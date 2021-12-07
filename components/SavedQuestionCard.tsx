import { storage } from "@/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
// import useAuth from "../firebase/auth/hook/auth";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";

const Card = ({ email, questionCard, setQuestionCard }: any) => {
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };
  // const { user }: any = useAuth();
  const [image, setImage] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState("");
  const [form, setForm] = useState<any>();
  const [answerScheme, setAnswerScheme] = useState("");
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
    const question =
      form?.question +
      "\n\nA " +
      form?.A +
      "\nB " +
      form?.B +
      "\nC " +
      form?.C +
      "\nD " +
      form?.D +
      "\n";

    if (image) {
      const id = uuidv4();
      const storageRef = ref(storage, id);
      uploadBytes(storageRef, image).then(() => {
        getDownloadURL(storageRef).then(async (url) => {
          await fetch("/api/db/teacher/saveQuestion", {
            method: "POST",
            body: JSON.stringify({
              email,
              url,
              class_code: form?.class_code,
              question,
              answerScheme,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
        });
      });
    } else {
      await fetch("/api/db/teacher/saveQuestion", {
        method: "POST",
        body: JSON.stringify({
          email,
          class_code: form?.class_code,
          question,
          answerScheme,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    refreshData();
    setQuestionCard(0);
    setImage(null);
  };
  return (
    <div>
      {questionCard !== 0 && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full py-5 bg-gray-200 bg-opacity-50">
          <div className="relative w-full max-w-3xl max-h-full px-10 py-10 mx-auto overflow-y-auto text-black bg-white rounded-lg shadow-2xl 2xl:max-w-5xl">
            <h3 className="mb-5 font-bold">Save A New Question</h3>
            <button
              type="button"
              onClick={() => {
                setQuestionCard(0);
                setImage(null);
                setImageURL("");
              }}
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
                placeholder="WIX 2002"
                className="w-full px-4 py-2 mb-8 border rounded-md focus:outline-none focus:border-gray-400"
                name="class_code"
                onChange={handleChange}
                required
                autoComplete="off"
              />

              <h5 className="mb-2 font-semibold">Question: </h5>
              <textarea
                placeholder="How do you instantiate an array in Java?"
                className="w-full px-4 py-2 mb-2 border min-h-[100px] rounded-md focus:outline-none focus:border-gray-400"
                name="question"
                onChange={handleChange}
              />
              <div className="w-full">
                <input
                  type="file"
                  accept="image/*"
                  id="file"
                  onChange={async (e) => {
                    // @ts-ignore
                    let file = await e.target.files[0];
                    let url;
                    try {
                      url = URL.createObjectURL(file);
                      setImageURL(url);
                    } catch (error) {}
                    setImage(file);
                  }}
                  hidden
                />
                <label
                  htmlFor="file"
                  className="flex flex-col items-center justify-center w-full p-6 mb-5 border rounded-md cursor-pointer"
                >
                  {!image ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="48"
                      height="48"
                      className="mb-2 text-gray-600"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path
                        fill="currentColor"
                        d="M17.409 19c-.776-2.399-2.277-3.885-4.266-5.602A10.954 10.954 0 0 1 20 11V3h1.008c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3H6V1h2v4H4v7c5.22 0 9.662 2.462 11.313 7h2.096zM18 1v4h-8V3h6V1h2zm-1.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
                      />
                    </svg>
                  ) : (
                    <div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="h-10 mb-2" src={imageURL} alt="image" />
                    </div>
                  )}
                  <div>
                    {!image && (
                      <h5 className="text-sm">
                        <span className="font-semibold">Upload</span> image
                      </h5>
                    )}
                  </div>
                  <h5 className="text-sm font-semibold">{image?.name}</h5>
                </label>
              </div>
              <div className="flex items-center mb-2 space-x-5">
                <h5 className="pl-2 font-semibold">A</h5>
                <input
                  type="text"
                  placeholder="int arr[] = new int(3);"
                  className="w-full px-4 py-2 placeholder-gray-300 border rounded-md focus:outline-none focus:border-gray-400"
                  name="A"
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="flex items-center mb-2 space-x-5">
                <h5 className="pl-2 font-semibold">B</h5>
                <input
                  type="text"
                  placeholder="int arr[];"
                  className="w-full px-4 py-2 placeholder-gray-300 border rounded-md focus:outline-none focus:border-gray-400"
                  name="B"
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
              <div className="flex items-center mb-2 space-x-5">
                <h5 className="pl-2 font-semibold">C</h5>
                <input
                  type="text"
                  placeholder="int arr[] = new int[3];"
                  className="w-full px-4 py-2 placeholder-gray-300 border rounded-md focus:outline-none focus:border-gray-400"
                  name="C"
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
              <div className="flex items-center mb-2 space-x-5">
                <h5 className="pl-2 font-semibold">D</h5>
                <input
                  type="text"
                  placeholder="int arr() = new int(3);"
                  className="w-full px-4 py-2 placeholder-gray-300 border rounded-md focus:outline-none focus:border-gray-400"
                  name="D"
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
              <div className="flex items-center justify-end mb-2 space-x-5">
                <h5 className="pl-2 font-semibold">Answer</h5>
                <input
                  type="text"
                  pattern="[ABCDabcd]{1}"
                  placeholder="A"
                  className="w-20 px-4 py-2 placeholder-gray-300 border rounded-md focus:outline-none focus:border-gray-400"
                  name="answerScheme"
                  required
                  onChange={(e) => {
                    let { value } = e.target;
                    value = value.replace(/[^ABCDabcd]/gi, "").toUpperCase();
                    setAnswerScheme(value);
                  }}
                  value={answerScheme}
                  autoComplete="off"
                />
              </div>

              <div className="flex justify-end w-full gap-5 mt-8">
                <button
                  type="submit"
                  className="px-5 py-2 font-medium text-white transition-all duration-150 bg-black border-2 border-black rounded-md hover:bg-white hover:text-black"
                >
                  Create
                </button>
                <button
                  type="button"
                  className="px-5 py-2 font-medium text-red-500 transition-all duration-150 bg-white border-2 border-red-500 rounded-md hover:bg-red-500 hover:text-white"
                  onClick={() => {
                    setQuestionCard(0);
                    setImage(null);
                    setImageURL("");
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
