import { Message } from ".prisma/client";
import useAuth from "../firebase/auth/hook/auth";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import ScrollableFeed from "react-scrollable-feed";

const Card = ({ session_id, end, chatCard, setChatCard }: any) => {
  const [data, setData] = useState();
  const sendRequest = async () => {
    const response = await fetch(
      `/api/db/message/get/?session_id=${session_id}`
    );

    const res = await response.json();

    setData(res.chat);
  };

  let timer: any;

  useEffect(() => {
    sendRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    timer = setInterval(() => {
      sendRequest();
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const { user }: any = useAuth();
  const [form, setForm] = useState<Message>();
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
    await fetch("/api/db/message/create", {
      method: "POST",
      body: JSON.stringify({
        session_id,
        sender: user?.email,
        ...form,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // @ts-ignore
    e.target.reset();
  };
  return (
    <div>
      {chatCard !== 0 && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full px-5 py-10 bg-gray-200 bg-opacity-50">
          <div className="relative w-full h-full max-w-5xl max-h-full px-10 py-10 mx-auto text-black bg-white rounded-lg shadow-2xl 2xl:max-w-5xl">
            <h3 className="mb-5 font-bold">Chat</h3>
            <button
              type="button"
              onClick={() => setChatCard(0)}
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
            <div className="grid h-full gap-5 chat chatbox">
              <div className="w-full h-full p-6 overflow-auto border rounded-lg">
                <ScrollableFeed>
                  {
                    // @ts-ignore
                    data?.map((message: Message) => (
                      <div key={message.id} className="mb-4">
                        <h4 className="font-bold">
                          {message?.sender === user?.email
                            ? "You"
                            : "Anonymous"}
                        </h4>
                        <h5>{message?.text}</h5>
                      </div>
                    ))
                  }
                </ScrollableFeed>
              </div>
              <form className="" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder={end ? "Session ended" : "Type..."}
                  className="w-full px-4 py-2 mb-8 border rounded-md focus:outline-none focus:border-gray-400"
                  name="text"
                  onChange={handleChange}
                  disabled={end}
                  required
                  autoComplete="off"
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
