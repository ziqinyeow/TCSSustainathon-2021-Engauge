import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

const Card = ({ email, session_id, questionCard, setQuestionCard }: any) => {
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };
  const [form, setForm] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const { data } = useSWR(
    `/api/db/teacher/getQuestion?email=${email}`,
    fetcher
  );

  const filteredQuestion = data?.question
    ?.sort(
      (
        a: { startedAt: string | number | Date },
        b: { startedAt: string | number | Date }
      ) => Number(new Date(b.startedAt)) - Number(new Date(a.startedAt))
    )
    .filter((question: { question: string }) =>
      question.question.toLowerCase().includes(searchValue.toLowerCase())
    );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQuestionCard(0);
    Promise.all(
      // @ts-ignore
      form?.map((f) => {
        fetch("/api/db/question/create", {
          method: "POST",
          body: JSON.stringify({
            // @ts-ignore
            ...f,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      })
    );

    refreshData();
  };
  return (
    <div>
      {questionCard !== 0 && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full py-5 bg-gray-200 bg-opacity-50">
          <div className="relative w-full max-w-3xl max-h-full px-10 py-10 mx-auto overflow-y-auto text-black bg-white rounded-lg shadow-2xl 2xl:max-w-5xl">
            <h3 className="mb-5 font-bold">Import Question</h3>
            <button
              type="button"
              onClick={() => setQuestionCard(0)}
              className="absolute p-2 text-black transition-all duration-300 rounded-full top-2 right-2 hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"
                />
              </svg>
            </button>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="w-full px-4 py-2 mb-5 mr-4 transition-all duration-200 border rounded-lg hover:bg-gray-100 focus:bg-gray-100"
                placeholder="Search"
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <div className="flex justify-end w-full mb-5 text-gray-400">
                {filteredQuestion?.length ? filteredQuestion?.length : 0}{" "}
                {filteredQuestion?.length > 1 ? "questions" : "question"}
              </div>
              <div className="">
                {filteredQuestion && filteredQuestion.length !== 0 ? (
                  <div className="sm:max-h-[60vh] mb-10 overflow-y-auto">
                    {filteredQuestion?.map((question: any) => (
                      <div
                        key={question.id}
                        onClick={() => {
                          if (
                            form?.findIndex(
                              (f: any) => f?.id === question?.id
                            ) === -1
                          ) {
                            setForm([
                              // @ts-ignore
                              ...form,
                              {
                                // @ts-ignore
                                session_id,
                                // @ts-ignore
                                id: question?.id,
                                // @ts-ignore
                                url: question?.url,
                                // @ts-ignore
                                question: question?.question,
                                // @ts-ignore
                                answerScheme: question?.answerScheme,
                              },
                            ]);
                          } else {
                            setForm(
                              form?.filter((x: any) => x?.id !== question?.id)
                            );
                          }
                        }}
                        className={`p-6 mb-4 transition-all duration-200 rounded ${
                          form?.findIndex(
                            (x: any) => x?.id === question?.id
                          ) !== -1
                            ? "bg-gray-100 hover:bg-gray-100"
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        <h4 className="font-bold">{question?.class_code}</h4>
                        <h5 className="mb-3 font-medium text-gray-400">
                          {question?.question}
                        </h5>
                        <div className="flex items-center space-x-2">
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
                            {new Date(question.createdAt).toLocaleDateString()}
                          </h5>
                          <h5 className="text-xs font-medium">
                            {
                              new Date(question.createdAt)
                                .toTimeString()
                                .split(" ")[0]
                            }
                          </h5>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full p-6 space-y-2 text-gray-600 bg-white rounded-md h-80 min-h-28">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="64"
                      height="64"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path
                        fill="currentColor"
                        d="M14.997 2L21 8l.001 4.26A5.466 5.466 0 0 0 17.5 11l-.221.004a5.503 5.503 0 0 0-5.127 4.205l-.016.074-.03.02A4.75 4.75 0 0 0 10.878 22L3.993 22a.993.993 0 0 1-.986-.876L3 21.008V2.992c0-.498.387-.927.885-.985L4.002 2h10.995zM17.5 13a3.5 3.5 0 0 1 3.5 3.5l-.001.103a2.75 2.75 0 0 1-.581 5.392L20.25 22h-5.5l-.168-.005a2.75 2.75 0 0 1-.579-5.392L14 16.5a3.5 3.5 0 0 1 3.5-3.5z"
                      />
                    </svg>
                    <h4 className="font-bold">No question</h4>
                  </div>
                )}
              </div>

              <div className="flex justify-end w-full gap-5">
                <button
                  type="submit"
                  className="px-5 py-2 font-medium text-white transition-all duration-150 bg-black border-2 border-black rounded-md hover:bg-white hover:text-black"
                >
                  Import
                </button>
                <button
                  type="button"
                  className="px-5 py-2 font-medium text-red-500 transition-all duration-150 bg-white border-2 border-red-500 rounded-md hover:bg-red-500 hover:text-white"
                  onClick={() => {
                    setQuestionCard(0);
                  }}
                >
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
