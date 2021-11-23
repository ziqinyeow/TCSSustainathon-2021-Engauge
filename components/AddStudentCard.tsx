import { Session } from ".prisma/client";
// import useAuth from "../firebase/auth/hook/auth";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";

const Card = ({ session_id, addStudentCard, setAddStudentCard }: any) => {
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };
  // const { user }: any = useAuth();
  const [form, setForm] = useState<Session>();
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value }: any = e.target;
    // @ts-ignore
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emails = form?.email.split(", ");
    Promise.all(
      // @ts-ignore
      emails?.map((email) => {
        fetch("/api/db/student/join", {
          method: "POST",
          body: JSON.stringify({
            session_id,
            email,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      })
    );
    setAddStudentCard(0);
    refreshData();
  };
  return (
    <div>
      {addStudentCard !== 0 && (
        <div className="fixed top-0 left-0 z-50 flex flex-col items-center justify-center w-full h-full py-5 bg-gray-200 bg-opacity-50">
          <div className="relative w-full max-w-3xl max-h-full px-10 py-10 mx-auto mb-10 overflow-y-auto text-black bg-white rounded-lg shadow-2xl 2xl:max-w-5xl">
            <h3 className="mb-6 font-bold">New Student</h3>
            <h5 className="mb-4 font-semibold">Session Code: </h5>
            <button
              type="button"
              onClick={() => setAddStudentCard(0)}
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
            <div
              onClick={() => {
                navigator.clipboard.writeText(session_id);
              }}
              className="w-full p-6 transition-all duration-100 border rounded-md cursor-pointer active:bg-green-200 group"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium">
                  <span className="font-normal">{session_id}</span>
                </h4>
                <div className="p-2 transition-all duration-500 opacity-0 group-hover:opacity-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="text-gray-700"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      fill="currentColor"
                      d="M7 6V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3v3c0 .552-.45 1-1.007 1H4.007A1.001 1.001 0 0 1 3 21l.003-14c0-.552.45-1 1.006-1H7zM5.002 8L5 20h10V8H5.002zM9 6h8v10h2V4H9v2zm-2 5h6v2H7v-2zm0 4h6v2H7v-2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full max-w-3xl max-h-full px-10 py-10 mx-auto overflow-y-auto text-black bg-white rounded-lg shadow-2xl 2xl:max-w-5xl">
            <form onSubmit={handleSubmit}>
              <h5 className="mb-4 font-semibold">Or Add Student Email: </h5>
              <textarea
                placeholder="xxx@gmail.com, yyy@apple.com, ..."
                className="w-full px-4 py-2 mb-2 border min-h-[150px] rounded-md focus:outline-none focus:border-gray-400"
                name="email"
                onChange={handleChange}
              />
              <h5 className="mb-8">
                <span className="font-semibold">Note:</span> Make sure that all
                the emails have registered the mobile app.
              </h5>
              <div className="flex justify-end w-full gap-5">
                <button
                  type="submit"
                  className="px-5 py-2 font-medium text-white transition-all duration-150 bg-black border-2 border-black rounded-md hover:bg-white hover:text-black"
                >
                  Add
                </button>
                <button
                  type="button"
                  className="px-5 py-2 font-medium text-red-500 transition-all duration-150 bg-white border-2 border-red-500 rounded-md hover:bg-red-500 hover:text-white"
                  onClick={() => {
                    setAddStudentCard(0);
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
