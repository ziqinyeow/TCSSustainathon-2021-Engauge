import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import useAuth from "@/firebase/auth/hook/auth";
import { withProtected } from "@/firebase/auth/hook/route";
import { Student } from ".prisma/client";
import { prisma } from "@/lib/prisma";
import Layout from "@/layouts/Layout";
import CreateQuestionCard from "@/components/CreateQuestionCard";
import ChatCard from "@/components/ChatCard";
import EndSession from "@/components/EndSession";
import AddStudentCard from "@/components/AddStudentCard";
import BarChart from "@/components/BarChart";
import CircularProgressBar from "@/components/CircularProgressBar";

// @ts-ignore
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const session: any = await prisma.session.findUnique({
    where: {
      // @ts-ignore
      id: params?.id,
    },
    include: {
      quiz: {
        include: {
          question: {
            include: {
              answer: {
                include: {
                  student: true,
                },
              },
            },
          },
        },
      },
      chat: {
        include: {
          message: true,
        },
      },
      student: {
        include: {
          location: true,
        },
      },
      feedback: true,
    },
  });

  if (!session?.end) {
    return {
      props: {
        session: JSON.parse(JSON.stringify(session)),
      },
    };
  }
  const total_student = session?.student?.length;
  const total_question = session?.quiz?.question?.length;
  const ques_counter = Array.from(
    { length: total_question },
    (_, i) => `Question ${i + 1}`
  );
  const attendance: any = [];
  const question_submission_rate: any[] = [];
  const question_correctness_rate: any[] = [];
  const feedback_mean =
    session?.feedback?.reduce(
      (a: any, b: { rating: any }) => a + Number(b?.rating),
      0
    ) / session?.feedback?.length;

  if (total_student === 0) {
    return {
      props: {
        session: JSON.parse(JSON.stringify(session)),
        attendance: {
          attendance,
          total_student,
          number_attend: 0,
          location_mean: 0,
          total_question,
          ques_counter,
          question_submission_rate,
          question_correctness_rate,
        },
      },
    };
  }

  session?.quiz?.question?.map(
    (ques: { answer: any[]; answerScheme: string }) => {
      question_submission_rate.push(
        (ques?.answer?.length / total_student) * 100
      );
      let correct = 0;
      ques?.answer?.map(
        (ans: { answer: string; student_email: any; email: any }) => {
          const email = ans?.student_email;
          if (ques?.answerScheme?.toLowerCase() === ans?.answer.toLowerCase()) {
            correct++;
            if (
              attendance.findIndex(
                (t: { email: any }) => t?.email === email
              ) === -1
            ) {
              attendance.push({
                email: ans?.student_email,
                correct: 1,
                submit: 1,
              });
            } else {
              const idx = attendance.findIndex(
                (x: { email: any }) => x?.email === email
              );
              // @ts-ignore
              attendance[idx]?.correct = attendance[idx]?.correct + 1;
              // @ts-ignore
              attendance[idx]?.submit = attendance[idx]?.submit + 1;
            }
          } else {
            if (
              attendance.findIndex(
                (t: { email: any }) => t?.email === email
              ) === -1
            ) {
              attendance.push({
                email: ans?.student_email,
                correct: 0,
                submit: 1,
              });
            } else {
              const idx = attendance.findIndex(
                (x: { email: any }) => x?.email === email
              );
              // @ts-ignore
              attendance[idx]?.submit = attendance[idx]?.submit + 1;
            }
          }
        }
      );
      question_correctness_rate.push((correct / ques?.answer?.length) * 100);
    }
  );

  function std(array: any[]) {
    if (!array || array.length === 0) {
      return -1;
    }
    const n = array.length;

    const lattitude_mean =
      array.reduce((a: any, b: any) => a + Number(b?.lattitude), 0) / n;
    const lattitude_std = Math.sqrt(
      array
        .map((x) => Math.pow(x?.lattitude - lattitude_mean, 2))
        .reduce((a: any, b: any) => a + Number(b), 0) / n
    );

    const longitude_mean =
      array.reduce((a: any, b: any) => a + Number(b?.longitude), 0) / n;
    const longitude_std = Math.sqrt(
      array
        .map((x) => Math.pow(x?.longitude - longitude_mean, 2))
        .reduce((a: any, b: any) => a + Number(b), 0) / n
    );

    return (lattitude_std + longitude_std) / 2;
  }

  const location: any = [];
  const average = (array: any[]) =>
    array.reduce((a: any, b: any) => a + b) / array.length;

  session?.student?.map((stu: { location: any[]; email: any }) => {
    const location_std = std(stu?.location);
    if (location_std !== -1) {
      location.push(location_std);
    }
    if (
      attendance.findIndex((t: { email: any }) => t?.email === stu?.email) ===
      -1
    ) {
      attendance.push({
        email: stu?.email,
        location_std,
      });
    } else {
      const idx = attendance.findIndex(
        (x: { email: any }) => x?.email === stu?.email
      );
      // @ts-ignore
      attendance[idx]?.location_std = location_std;
    }
  });

  const location_mean = average(location);

  attendance?.map(
    (q: {
      submission_rate: number;
      submit: number;
      correctness_rate: number;
      correct: number;
      attend: boolean;
      location_std: number;
    }) => {
      q.submission_rate = (q?.submit / session?.quiz?.question?.length) * 100;
      q.correctness_rate = (q?.correct / q?.submit) * 100;
      q.attend =
        (q?.location_std < 0.001 && q?.location_std > -1) ||
        q?.submission_rate === 100
          ? true
          : false;
    }
  );

  const number_attend = attendance?.filter(
    (a: { attend: boolean }) => a.attend === true
  );

  return {
    props: {
      session: JSON.parse(JSON.stringify(session)),
      attendance: {
        attendance,
        total_student,
        number_attend: number_attend.length,
        location_mean,
        total_question,
        ques_counter,
        question_submission_rate,
        question_correctness_rate,
        feedback_mean,
        feedback_number: session?.feedback?.length,
      },
    },
  };
};

// eslint-disable-next-line no-unused-vars
function SessionPage({ session, attendance }: any) {
  const { user }: any = useAuth();
  const router = useRouter();
  const [questionCard, setQuestionCard] = useState(0);
  const [chatCard, setChatCard] = useState(0);
  const [endSessionCard, setEndSessionCard] = useState(0);
  const [addStudentCard, setAddStudentCard] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState([]);
  const [sort, setSort] = useState(true);
  const filteredStudents = !session?.end
    ? session?.student?.filter((student: { email: string }) =>
        // @ts-ignore
        student?.email.toLowerCase().includes(searchValue.toLowerCase())
      )
    : attendance?.attendance
        .filter((a: { email: string }) =>
          // @ts-ignore
          a?.email.toLowerCase().includes(searchValue.toLowerCase())
        )
        .sort((x: any, y: any) =>
          sort ? (x === y ? 0 : x ? -1 : 1) : x === y ? 0 : x ? 1 : -1
        );

  useEffect(() => {
    if (session?.email !== user.email) {
      router.push("/");
    }
  }, [router, session?.email, user.email]);

  return (
    <div>
      <Head>
        <title>{session?.name}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex items-center justify-between w-full mb-7">
          <h2>
            {session?.class_code}: {session?.name}
          </h2>
          <div className="space-x-3">
            <button
              onClick={() => {
                setChatCard(1);
              }}
              className="p-2 transition-all duration-200 bg-white rounded-lg hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M6.455 19L2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.455zm-.692-2H20V5H4v13.385L5.763 17zM11 10h2v2h-2v-2zm-4 0h2v2H7v-2zm8 0h2v2h-2v-2z" />
              </svg>
            </button>
            {!session?.end && (
              <button
                onClick={() => {
                  setEndSessionCard(1);
                }}
                className="p-2 transition-all duration-200 bg-white rounded-lg hover:bg-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M9 1v2h6V1h2v2h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4V1h2zm11 9H4v9h16v-9zm-4.964 1.136l1.414 1.414-4.95 4.95-3.536-3.536L9.38 12.55l2.121 2.122 3.536-3.536zM7 5H4v3h16V5h-3v1h-2V5H9v1H7V5z" />
                </svg>
              </button>
            )}
            <ChatCard
              session_id={session?.id}
              end={session?.end}
              chatCard={chatCard}
              setChatCard={setChatCard}
            />
            <EndSession
              session_id={session?.id}
              endSessionCard={endSessionCard}
              setEndSessionCard={setEndSessionCard}
            />
          </div>
        </div>
        <div
          className={`grid w-full gap-5 ${
            session?.end ? "lg:grid-cols-4" : "md:grid-cols-3"
          }`}
        >
          <div className="w-full p-4 bg-white rounded-md">
            <div className="p-3 mb-3 rounded-md bg-gray-50 w-min">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M4 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H4zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
              </svg>
            </div>
            <h4 className="font-medium">Total Students</h4>
            <h2>
              {session?.end
                ? attendance?.total_student
                : session?.student?.length}
            </h2>
          </div>
          <div className="w-full p-4 bg-white rounded-md">
            <div className="p-3 mb-3 rounded-md bg-gray-50 w-min">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M14 14.252v2.09A6 6 0 0 0 6 22l-2-.001a8 8 0 0 1 10-7.748zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm5.793 8.914l3.535-3.535 1.415 1.414-4.95 4.95-3.536-3.536 1.415-1.414 2.12 2.121z" />
              </svg>
            </div>
            <h4 className="font-medium">Present</h4>
            <h2>
              {session?.end
                ? attendance?.number_attend
                : session?.student.length}
            </h2>
          </div>
          <div className="w-full p-4 bg-white rounded-md">
            <div className="p-3 mb-3 rounded-md bg-gray-50 w-min">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M14 14.252v2.09A6 6 0 0 0 6 22l-2-.001a8 8 0 0 1 10-7.748zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm7 6.586l2.121-2.122 1.415 1.415L20.414 19l2.122 2.121-1.415 1.415L19 20.414l-2.121 2.122-1.415-1.415L17.586 19l-2.122-2.121 1.415-1.415L19 17.586z" />
              </svg>
            </div>
            <h4 className="font-medium">Absent</h4>
            <h2>
              {session?.end
                ? attendance?.total_student - attendance?.number_attend
                : "--"}
            </h2>
          </div>
          {session?.end && (
            <div className="w-full p-4 bg-white rounded-md">
              <div className="p-3 mb-3 rounded-md bg-gray-50 w-min">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M14 14.252v2.09A6 6 0 0 0 6 22l-2-.001a8 8 0 0 1 10-7.748zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm7 6.586l2.121-2.122 1.415 1.415L20.414 19l2.122 2.121-1.415 1.415L19 20.414l-2.121 2.122-1.415-1.415L17.586 19l-2.122-2.121 1.415-1.415L19 17.586z" />
                </svg>
              </div>
              <h4 className="font-medium">Total Feedback</h4>
              <h2>{attendance?.feedback_number}</h2>
            </div>
          )}
          {session?.end && (
            <div className="hidden col-span-1 p-4 bg-white rounded-md min-h-64 lg:block lg:col-span-2">
              <BarChart
                title1=" Submission Rate "
                xAxis={attendance?.ques_counter}
                yAxis1={attendance?.question_submission_rate}
                title2=" Correctness Rate "
                yAxis2={attendance?.question_correctness_rate}
              />
            </div>
          )}
          {session?.end && (
            <div className="flex flex-col items-center justify-between p-6 bg-white rounded-md">
              <h4 className="mb-4 font-semibold text-center">
                Student Avg. Location Distribution
              </h4>
              <div className="flex items-center justify-center w-full mt-5 dark:text-gray-50">
                <div className="flex items-center justify-center w-32">
                  <CircularProgressBar
                    percentage={
                      Math.round(
                        (Number(attendance?.location_mean) + Number.EPSILON) *
                          100
                      ) / 100
                    }
                  />
                </div>
              </div>
            </div>
          )}
          {session?.end && (
            <div className="flex flex-col items-center justify-between p-6 bg-white rounded-md">
              <h4 className="mb-4 font-semibold text-center">Feedback Score</h4>
              <div className="flex items-center justify-center w-full mt-5 dark:text-gray-50">
                <div className="flex items-center justify-center w-32">
                  <CircularProgressBar
                    percentage={
                      Math.round(
                        ((Number(attendance?.feedback_mean) / 5) * 100 +
                          Number.EPSILON) *
                          100
                      ) / 100
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div
          className={
            session?.end
              ? "w-full gap-10 my-10 md:grid-cols-3"
              : "grid w-full gap-10 my-10 md:grid-cols-3"
          }
        >
          <div className="mt-5 md:col-span-2">
            <h3 className="mb-5 font-bold">Student List</h3>
            <div className="flex mb-10">
              <input
                type="text"
                className="w-full p-2 px-4 mr-3 transition-all duration-200 border rounded-lg hover:bg-gray-100 focus:bg-gray-100"
                placeholder="Search"
                onChange={(e) => setSearchValue(e.target.value)}
              />
              {session?.end ? (
                <div>
                  <button
                    onClick={() => setSort((prev) => !prev)}
                    className="p-3 text-black transition-all duration-200 bg-white border rounded-lg hover:bg-gray-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M11 4h10v2H11V4zm0 4h6v2h-6V8zm0 6h10v2H11v-2zm0 4h6v2h-6v-2zM3 4h6v6H3V4zm2 2v2h2V6H5zm-2 8h6v6H3v-6zm2 2v2h2v-2H5z" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setAddStudentCard(1)}
                    className="p-3 text-black transition-all duration-200 bg-white border rounded-lg hover:bg-gray-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M14 14.252v2.09A6 6 0 0 0 6 22l-2-.001a8 8 0 0 1 10-7.748zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm6 6v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z" />
                    </svg>
                  </button>
                  <AddStudentCard
                    session_id={session?.id}
                    addStudentCard={addStudentCard}
                    setAddStudentCard={setAddStudentCard}
                  />
                </div>
              )}
            </div>
            <div className="space-y-4">
              {filteredStudents && filteredStudents.length !== 0 ? (
                <div>
                  {filteredStudents.map((s: Student | any) => (
                    <div key={s.email} className="mb-4">
                      {session?.end ? (
                        <div>
                          <div className="grid grid-cols-2 gap-5 p-4 transition-all duration-150 bg-white rounded-md">
                            <div className="py-2 overflow-hidden">
                              {s.email}
                            </div>
                            <div className="flex justify-end space-x-1">
                              <div
                                className={`px-3 py-2 overflow-hidden rounded ${
                                  s.attend ? "bg-green-200" : "bg-red-200"
                                }`}
                              >
                                {s.attend ? "present" : "absent"}
                              </div>

                              <a
                                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${s.email}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <div
                                  className={`hidden sm:inline-flex px-3 py-2 transition-all duration-200 overflow-hidden rounded items-center h-full ${
                                    s.attend
                                      ? `bg-green-50 hover:bg-green-100`
                                      : "bg-red-50 hover:bg-red-100"
                                  }`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="18"
                                    height="18"
                                    className="text-gray-600"
                                  >
                                    <path fill="none" d="M0 0h24v24H0z" />
                                    <path
                                      fill="currentColor"
                                      d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17 4.238l-7.928 7.1L4 7.216V19h16V7.238zM4.511 5l7.55 6.662L19.502 5H4.511z"
                                    />
                                  </svg>
                                </div>
                              </a>
                              <div
                                onClick={() => {
                                  if (
                                    open.findIndex((x) => x === s?.email) === -1
                                  ) {
                                    // @ts-ignore
                                    setOpen([...open, s?.email]);
                                  } else {
                                    setOpen(
                                      open?.filter((y) => y !== s?.email)
                                    );
                                  }
                                }}
                                className={`cursor-pointer px-3 py-2 overflow-hidden rounded transition-all duration-200 flex items-center ${
                                  s.attend
                                    ? `bg-green-50 hover:bg-green-100`
                                    : "bg-red-50 hover:bg-red-100"
                                }`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  width="18"
                                  height="18"
                                  className="text-gray-600"
                                >
                                  <path fill="none" d="M0 0h24v24H0z" />
                                  <path
                                    fill="currentColor"
                                    d="M12 16l-6-6h12z"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                          {open?.findIndex((x) => x === s?.email) !== -1 && (
                            <div
                              className={`p-6 grid md:grid-cols-3 gap-10 mt-3 rounded-md select-none bg-white`}
                            >
                              <div className="flex flex-col items-center">
                                <h5 className="mb-4 font-semibold">
                                  Submission rate
                                </h5>
                                <div className="w-36">
                                  <CircularProgressBar
                                    percentage={
                                      Math.round(
                                        (Number(s?.submission_rate) +
                                          Number.EPSILON) *
                                          100
                                      ) / 100
                                    }
                                    pathColor={
                                      s?.submission_rate !== 100
                                        ? "#FEE2E2"
                                        : "#D1FAE5"
                                    }
                                  />
                                </div>
                              </div>
                              <div className="flex flex-col items-center">
                                <h5 className="mb-4 font-semibold">
                                  Correctness rate
                                </h5>
                                <div className="w-36">
                                  <CircularProgressBar
                                    percentage={
                                      Math.round(
                                        (Number(s?.correctness_rate) +
                                          Number.EPSILON) *
                                          100
                                      ) / 100
                                    }
                                    pathColor={
                                      s?.correctness_rate !== 100
                                        ? "#FEE2E2"
                                        : "#D1FAE5"
                                    }
                                    // trailColor={
                                    //   s?.correctness_rate !== 100
                                    //     ? "#FEF2F2"
                                    //     : "#ECFDF5"
                                    // }
                                  />
                                </div>
                              </div>
                              <div className="flex flex-col items-center">
                                <h5 className="mb-4 font-semibold">
                                  Location std
                                </h5>
                                <div className="w-36">
                                  <CircularProgressBar
                                    percentage={
                                      Math.round(
                                        (Number(s?.location_std) +
                                          Number.EPSILON) *
                                          100
                                      ) / 100
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${s.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="grid grid-cols-2 gap-5 p-4 transition-all duration-150 bg-white rounded-md hover:bg-gray-100">
                            <div className="py-2 overflow-hidden">
                              {s.email}
                            </div>
                            <div className="flex justify-end space-x-2">
                              <div className="px-3 py-2 overflow-hidden bg-green-200 rounded">
                                active
                              </div>
                            </div>
                          </div>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full min-h-[200px] p-6 space-y-2 bg-white rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="48"
                    height="48"
                    className="text-gray-300"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      fill="currentColor"
                      d="M3.783 2.826L12 1l8.217 1.826a1 1 0 0 1 .783.976v9.987a6 6 0 0 1-2.672 4.992L12 23l-6.328-4.219A6 6 0 0 1 3 13.79V3.802a1 1 0 0 1 .783-.976zM5 4.604v9.185a4 4 0 0 0 1.781 3.328L12 20.597l5.219-3.48A4 4 0 0 0 19 13.79V4.604L12 3.05 5 4.604zM12 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm-4.473 5a4.5 4.5 0 0 1 8.946 0H7.527z"
                    />
                  </svg>
                  <h4 className="font-bold text-gray-600">No student yet</h4>
                </div>
              )}
            </div>
          </div>
          {session?.end ? (
            <div></div>
          ) : (
            <div className="w-full md:col-span-1">
              <div className="flex items-center mb-5">
                <h3 className="w-full font-bold">Question</h3>
                <button
                  onClick={() => setQuestionCard(1)}
                  className="p-2 transition-all duration-200 bg-white rounded-lg hover:bg-gray-200 hover:text-black"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      fill="currentColor"
                      d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"
                    />
                  </svg>
                </button>
                <CreateQuestionCard
                  email={user?.email}
                  session_id={session?.id}
                  questionCard={questionCard}
                  setQuestionCard={setQuestionCard}
                />
              </div>
              <div className="h-full">
                {session?.quiz?.question &&
                session?.quiz?.question?.length !== 0 ? (
                  <div>
                    {session?.quiz?.question?.map((question: any) => (
                      <Link key={question.id} href={`/question/${question.id}`}>
                        <a>
                          <div className="p-4 mb-4 transition-all duration-200 bg-white rounded hover:bg-gray-100">
                            <h5 className="mb-3 font-medium whitespace-pre-wrap">
                              {question.question}
                            </h5>
                            {/* <h5 className="mb-3 font-medium text-gray-400">
                            {question.name}
                          </h5> */}
                            <div className="flex items-center mb-2 space-x-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                              >
                                <path fill="none" d="M0 0h24v24H0z" />
                                <path d="M17 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4V1h2v2h6V1h2v2zm-2 2H9v2H7V5H4v4h16V5h-3v2h-2V5zm5 6H4v8h16v-8z" />
                              </svg>
                              <h5 className="text-xs font-medium">
                                {new Date(
                                  question.createdAt
                                ).toLocaleDateString()}
                              </h5>
                              <h5 className="text-xs font-medium">
                                {
                                  new Date(question.createdAt)
                                    .toTimeString()
                                    .split(" ")[0]
                                }
                              </h5>
                            </div>
                            <div className="flex items-center space-x-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                              >
                                <path fill="none" d="M0 0h24v24H0z" />
                                <path d="M14 14.252v2.09A6 6 0 0 0 6 22l-2-.001a8 8 0 0 1 10-7.748zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm6 6v-3.5l5 4.5-5 4.5V19h-3v-2h3z" />
                              </svg>
                              <h5 className="text-xs font-medium">
                                {question?.answer?.length}
                              </h5>
                            </div>
                          </div>
                        </a>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full min-h-[288px] p-6 space-y-2 text-gray-600 bg-white rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="48"
                      height="48"
                      className="text-gray-300"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path
                        fill="currentColor"
                        d="M15 5h2a2 2 0 0 1 2 2v8.17a3.001 3.001 0 1 1-2 0V7h-2v3l-4.5-4L15 2v3zM5 8.83a3.001 3.001 0 1 1 2 0v6.34a3.001 3.001 0 1 1-2 0V8.83zM6 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm12 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                      />
                    </svg>
                    <h4 className="font-bold">No question yet</h4>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
}
export default withProtected(SessionPage);
