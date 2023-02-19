import { Menu, Transition } from "@headlessui/react";
import { useUser } from "~/utils/user";
import { Form } from "@remix-run/react";

export default function AccountMenu() {
  const user = useUser();
  return (
    <div className="relative z-50 inline-block text-left">
      <Menu>
        {({ open }) => (
          <>
            <span className="">
              <Menu.Button className="inline-flex px-4 py-3 font-bold leading-5 hover:bg-slate-100 hover:text-gray-600">
                <span>{user.username}</span>
                <svg
                  className="ml-2 -mr-1 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Menu.Button>
            </span>

            <Transition
              show={open}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md border border-gray-200 bg-white shadow-lg outline-none"
              >
                <div className="px-4 py-3">
                  <p className="text-sm leading-5">Signed in as</p>
                  <p className="truncate font-medium leading-5 text-gray-900">
                    {user.email}
                  </p>
                </div>

                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/user/self"
                        className={`${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        } flex w-full justify-between px-4 py-2 text-left leading-5`}
                      >
                        My phrases
                      </a>
                    )}
                  </Menu.Item>
                </div>

                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Form action="/logout" method="post">
                        <button
                          type="submit"
                          className={`${
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700"
                          } flex w-full justify-between px-4 py-2 text-left leading-5`}
                        >
                          Sign out
                        </button>
                      </Form>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
}
