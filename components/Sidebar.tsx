import React from "react";
import Link from "next/link";
import useAuth from "@/firebase/auth/hook/auth";

export default function Sidebar() {
  const { user, logout }: any = useAuth();

  return (
    <div className="w-[80px] h-full p-4 flex flex-col items-center justify-between fixed bg-white">
      <div className="space-y-4">
        <Link href="/">
          <a>
            <div className="flex items-center justify-center mt-4 mb-7">
              <svg
                width="237"
                height="195"
                viewBox="0 0 237 195"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
              >
                <path
                  d="M7.50012 0.999912C6.40012 1.39991 4.40012 2.99991 3.00012 4.49991L0.500119 7.19991L0.200119 95.2999C0.000118802 179.4 0.100119 183.7 1.80012 187C5.80012 194.5 -2.09988 194 117.8 194C235.9 194 230 194.3 234 187.8C236 184.6 236 183 236 96.6999C236 -8.83401e-05 236.3 5.39991 230 1.59991C227.4 0.0999117 217.4 -8.83401e-05 118.3 0.0999117C58.5001 0.0999117 8.60012 0.499912 7.50012 0.999912ZM228 7.99991C230 9.99991 230 11.2999 230 96.2999C230 172.7 229.8 182.8 228.4 184.8L226.9 187H118.5C-1.09988 187 7.70012 187.5 6.50012 180.7C6.20012 178.9 6.10012 139.8 6.20012 93.6999L6.50012 9.79991L8.90012 7.89991C11.2001 6.09991 14.4001 5.99991 118.6 5.99991C224.7 5.99991 226 5.99991 228 7.99991Z"
                  fill="black"
                />
                <path
                  d="M54.7 23.0999C51.6 24.8999 50.7 27.8999 52.5 30.5999C54.3 33.3999 58.1 33.7999 60.4 31.3999C64.3 27.5999 59.4 20.4999 54.7 23.0999Z"
                  fill="black"
                />
                <path
                  d="M78.9002 23.3C74.1002 25.7 76.0002 33 81.5002 33C84.9002 33 87.5002 28.9 86.0002 26.1C84.4002 22.9 81.8002 21.9 78.9002 23.3Z"
                  fill="black"
                />
                <path
                  d="M28.2 24.2C27.5 24.9 27 26.6 27 28C27 31.3 28.7 33 32 33C35.3 33 37 31.3 37 28C37 24.7 35.3 23 32 23C30.6 23 28.9 23.5 28.2 24.2Z"
                  fill="black"
                />
                <path
                  d="M20.2 50.2001C18.4 52.0001 18.7 53.8001 20.9 55.0001C22.2 55.7001 54.4 56.0001 118.2 56.0001C219.5 56.0001 217.7 56.1001 216.8 51.4001C216.5 49.5001 214.5 49.5001 118.9 49.2001C43.9 49.0001 21.1 49.3001 20.2 50.2001Z"
                  fill="black"
                />
                <path
                  d="M79.5 85C59.2 91 40.5 96.4 38 97C34.2 98 33.8 98.4 35.5 99.1C36.6 99.6 55.7 105.2 77.9 111.6L118.4 123.3L141.9 116.5C154.9 112.8 166.1 109.5 166.8 109.3C167.7 108.9 168 112.6 168 125.8V142.9L163.3 143.5C145.2 145.9 129 150.6 122 155.4L118.6 157.7L112.5 154.4C104.8 150.2 92.1 146.4 79.5 144.5C74 143.7 69.2 143 68.8 143C68.3 143 68 136.9 68 129.5C68 118.3 67.7 115.8 66.5 115.4C65.7 115 64.3 115.3 63.5 116C62.2 117.1 62 120 62.2 133.4L62.5 149.5L71.5 150.2C88.2 151.4 103 155.7 113.4 162.4C118.2 165.5 119 165.7 120.1 164.4C125.2 158.3 152.9 150 168.3 150H174V125.4V100.8L171.3 101.5C169.7 101.8 157.6 105.3 144.3 109.1C131 112.9 119.3 116 118.2 116C116.3 116 58 99.4 57.2 98.6C57 98.3 58.3 97.7 60.2 97.2C62 96.7 75.7 92.8 90.7 88.4L117.9 80.6L148.2 89.3C164.9 94.1 180.9 98.7 183.7 99.6L189 101.1L189.2 120.3L189.5 139.5H192H194.5L194.8 117.8L195 96.1L189.8 94.5C131.7 77.8 118.4 74 117.5 74.1C117 74.2 99.9 79.1 79.5 85Z"
                  fill="black"
                />
                <path
                  d="M77 127.8V135.7L84.3 136.9C93.4 138.4 107 142.5 113.3 145.6L118.1 148L122.1 145.9C128.6 142.6 143.1 138.2 151.9 137L160 135.8V127.9C160 123.5 159.9 120 159.7 120C159.6 120 150.2 122.7 138.7 125.9L118 131.9L99.2 126.4C88.9 123.4 79.7 120.7 78.8 120.4C77.2 119.9 77 120.7 77 127.8Z"
                  fill="black"
                />
              </svg>
            </div>
          </a>
        </Link>
        <Link href="/">
          <a>
            <div className="p-2 mb-4 transition-all duration-200 rounded-md cursor-pointer hover:bg-black hover:bg-opacity-5 hover:shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M21 20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.49a1 1 0 0 1 .386-.79l8-6.222a1 1 0 0 1 1.228 0l8 6.222a1 1 0 0 1 .386.79V20zm-2-1V9.978l-7-5.444-7 5.444V19h14z" />
              </svg>
            </div>
          </a>
        </Link>
        <Link href="/history">
          <a>
            <div className="p-2 mb-4 transition-all duration-200 rounded-md cursor-pointer hover:bg-black hover:bg-opacity-5 hover:shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M20 22H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1zm-1-2V4H5v16h14zM8 7h8v2H8V7zm0 4h8v2H8v-2zm0 4h5v2H8v-2z" />
              </svg>
            </div>
          </a>
        </Link>
        <Link href="/question">
          <a>
            <div className="p-2 mb-4 transition-all duration-200 rounded-md cursor-pointer hover:bg-black hover:bg-opacity-5 hover:shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M4 5v14h16V7h-8.414l-2-2H4zm8.414 0H21a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7.414l2 2z" />
              </svg>
            </div>
          </a>
        </Link>
        {/* <Link href="/">
          <a> */}
        <div className="p-2 mb-4 transition-all duration-200 rounded-md cursor-pointer hover:bg-black hover:bg-opacity-5 hover:shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0L24 0 24 24 0 24z" />
            <path d="M17 2v2h3.007c.548 0 .993.445.993.993v16.014c0 .548-.445.993-.993.993H3.993C3.445 22 3 21.555 3 21.007V4.993C3 4.445 3.445 4 3.993 4H7V2h10zM7 6H5v14h14V6h-2v2H7V6zm2 10v2H7v-2h2zm0-3v2H7v-2h2zm0-3v2H7v-2h2zm6-6H9v2h6V4z" />
          </svg>
        </div>
        {/* </a>
        </Link> */}
      </div>
      <div className="mb-4 space-y-4">
        {user?.photoURL ? (
          <div className="flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              // width={100}
              // height={100}
              src={user.photoURL}
              alt="user_profile"
              className="object-cover rounded-full w-7 h-7"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              // width={100}
              // height={100}
              src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80"
              alt="user_profile"
              className="object-cover w-8 h-8 rounded-full"
            />
          </div>
        )}
        {user && (
          <div
            onClick={logout}
            className="p-2 transition-all duration-200 rounded-md cursor-pointer hover:bg-black hover:bg-opacity-5 hover:shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M4 18h2v2h12V4H6v2H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3zm2-7h7v2H6v3l-5-4 5-4v3z" />
            </svg>
          </div>
        )}
        <div className="p-2 transition-all duration-200 rounded-md cursor-pointer hover:bg-black hover:bg-opacity-5 hover:shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M2 12c0-.865.11-1.703.316-2.504A3 3 0 0 0 4.99 4.867a9.99 9.99 0 0 1 4.335-2.505 3 3 0 0 0 5.348 0 9.99 9.99 0 0 1 4.335 2.505 3 3 0 0 0 2.675 4.63c.206.8.316 1.638.316 2.503 0 .865-.11 1.703-.316 2.504a3 3 0 0 0-2.675 4.629 9.99 9.99 0 0 1-4.335 2.505 3 3 0 0 0-5.348 0 9.99 9.99 0 0 1-4.335-2.505 3 3 0 0 0-2.675-4.63C2.11 13.704 2 12.866 2 12zm4.804 3c.63 1.091.81 2.346.564 3.524.408.29.842.541 1.297.75A4.993 4.993 0 0 1 12 18c1.26 0 2.438.471 3.335 1.274.455-.209.889-.46 1.297-.75A4.993 4.993 0 0 1 17.196 15a4.993 4.993 0 0 1 2.77-2.25 8.126 8.126 0 0 0 0-1.5A4.993 4.993 0 0 1 17.195 9a4.993 4.993 0 0 1-.564-3.524 7.989 7.989 0 0 0-1.297-.75A4.993 4.993 0 0 1 12 6a4.993 4.993 0 0 1-3.335-1.274 7.99 7.99 0 0 0-1.297.75A4.993 4.993 0 0 1 6.804 9a4.993 4.993 0 0 1-2.77 2.25 8.126 8.126 0 0 0 0 1.5A4.993 4.993 0 0 1 6.805 15zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
