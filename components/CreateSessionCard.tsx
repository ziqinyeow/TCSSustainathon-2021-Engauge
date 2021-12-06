import { Session } from ".prisma/client";
import useAuth from "../firebase/auth/hook/auth";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/router";

const Card = ({ sessionCard, setSessionCard }: any) => {
  const router = useRouter();
  const { user }: any = useAuth();
  const [form, setForm] = useState<Session>();
  const [creating, setCreating] = useState(false);
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
    setCreating(true);

    const fetcher = await fetch("/api/db/session/create", {
      method: "POST",
      body: JSON.stringify({
        session: form,
        email: user.email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await fetcher.json();
    setCreating(false);
    setSessionCard(0);
    router.push(`/session/${result?.session?.id}`);
  };
  return (
    <div>
      {sessionCard !== 0 && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full py-5 bg-gray-200 bg-opacity-50">
          <div className="relative w-full max-w-3xl max-h-full px-10 py-10 mx-auto overflow-y-auto text-black bg-white rounded-lg shadow-2xl 2xl:max-w-5xl">
            <h3 className="mb-5 font-bold">Creating New Session</h3>
            <button
              type="button"
              onClick={() => setSessionCard(0)}
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
              <h5 className="mb-2 font-semibold">Class Code:</h5>
              <input
                type="text"
                placeholder="WIX 2001"
                className="w-full px-4 py-2 mb-8 border rounded-md focus:outline-none focus:border-gray-400"
                name="class_code"
                onChange={handleChange}
                required
                autoComplete="off"
              />
              <h5 className="mb-2 font-semibold">Session Name:</h5>
              <input
                type="text"
                placeholder="Programming Class 2"
                className="w-full px-4 py-2 mb-8 border rounded-md focus:outline-none focus:border-gray-400"
                name="name"
                onChange={handleChange}
                required
                autoComplete="off"
              />
              <h5 className="mb-2 font-semibold">Session Start Time: </h5>
              <input
                type="datetime-local"
                // placeholder="Programming Class 2"
                className="w-full px-4 py-2 mb-8 border rounded-md focus:outline-none focus:border-gray-400"
                name="startedAt"
                onChange={handleChange}
                // required
                autoComplete="off"
              />
              <div className="flex justify-end w-full gap-5">
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 font-medium text-white transition-all duration-150 bg-black border-2 border-black rounded-md disabled:opacity-20 disabled:hover:bg-black disabled:hover:text-white hover:bg-white hover:text-black"
                >
                  Create
                </button>
                <button
                  type="button"
                  disabled={creating}
                  className="px-5 py-2 font-medium text-red-500 transition-all duration-150 bg-white border-2 border-red-500 rounded-md disabled:opacity-20 disabled:hover:bg-white disabled:hover:text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => {
                    setSessionCard(0);
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
