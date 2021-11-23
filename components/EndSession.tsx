import { useRouter } from "next/router";
import { FormEvent } from "react";

const Card = ({ session_id, endSessionCard, setEndSessionCard }: any) => {
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetch("/api/db/session/end", {
      method: "POST",
      body: JSON.stringify({
        session_id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setEndSessionCard(0);
    refreshData();
  };
  return (
    <div>
      {endSessionCard !== 0 && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full py-5 bg-gray-200 bg-opacity-50">
          <div className="relative w-full max-w-3xl max-h-full px-10 py-10 mx-auto overflow-y-auto text-black bg-white rounded-lg shadow-2xl 2xl:max-w-5xl">
            <h3 className="mb-5 font-bold">End this Session</h3>
            <h5 className="mb-5 text-gray-400">
              Make sure that this session is end.
            </h5>
            <h5 className="mb-16 text-gray-600">
              Ending this session will generate an analyzed report with all the
              student attendance detailed.
            </h5>
            <button
              type="button"
              onClick={() => setEndSessionCard(0)}
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
              <div className="flex justify-end w-full gap-5">
                <button
                  type="submit"
                  className="px-5 py-2 font-medium text-red-500 transition-all duration-150 bg-white border-2 border-red-500 rounded-md hover:bg-red-500 hover:text-white"
                >
                  End Session
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
