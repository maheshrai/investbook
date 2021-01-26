import "../styles/globals.css";
import "../configureAmplify";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Auth, Hub, AmplifySignOut } from "aws-amplify";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";

function MyApp({ Component, pageProps }) {
  const [authState, setAuthState] = useState();
  const [user, setUser] = useState();
  const [tab, setTab] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, []);

  async function signOut() {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  return (
    <div>
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">
                  InvestBook
                </h2>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {/*<!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->*/}
                  <Link href="/">
                    <span
                      onClick={() => setTab("home")}
                      className={
                        tab === "home"
                          ? "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      }
                    >
                      Home
                    </span>
                  </Link>
                  <Link href="/portfolio">
                    <span
                      onClick={() => setTab("portfolio")}
                      className={
                        tab === "portfolio"
                          ? "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      }
                    >
                      My Portfolio
                    </span>
                  </Link>
                  <Link href="/benchmarks">
                    <span
                      onClick={() => setTab("benchmarks")}
                      className={
                        tab === "benchmarks"
                          ? "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      }
                    >
                      Benchmarks
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="ml-3 relative">
                  <div>
                    {authState !== AuthState.SignedIn && (
                      <Link href="/profile">
                        <button
                          onClick={() => setTab("profile")}
                          className="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-green-600 hover:bg-green-900"
                        >
                          Sign In
                        </button>
                      </Link>
                    )}
                    {authState === AuthState.SignedIn && user && (
                      <Link href="/profile">
                        <span
                          onClick={() => setTab("profile")}
                          className={
                            tab === "profile"
                              ? "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                          }
                        >
                          {user.username}
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              {/*<!-- Mobile menu button -->*/}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {/*<!--
              Heroicon name: menu

              Menu open: "hidden", Menu closed: "block"
            -->*/}
                <svg
                  className={!isMenuOpen ? "block h-6 w-6" : "hidden h-6 w-6"}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {/*<!--
              Heroicon name: x

              Menu open: "block", Menu closed: "hidden"
            -->*/}
                <svg
                  className={isMenuOpen ? "block h-6 w-6" : "hidden h-6 w-6"}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/*<!--
      Mobile menu, toggle classes based on menu state.

      Open: "block", closed: "hidden"
    -->*/}
        <div className={isMenuOpen ? "md:hidden" : "hidden md:hidden"}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/benchmarks">
              <span
                onClick={() => setTab("home")}
                className={
                  tab === "home"
                    ? "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                }
              >
                Home
              </span>
            </Link>

            <Link href="/benchmarks">
              <span
                onClick={() => setTab("portfolio")}
                className={
                  tab === "portfolio"
                    ? "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                }
              >
                My Portfolio
              </span>
            </Link>
            <Link href="/benchmarks">
              <span
                onClick={() => setTab("benchmarks")}
                className={
                  tab === "benchmarks"
                    ? "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                }
              >
                Benchmarks
              </span>
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            {authState !== AuthState.SignedIn && (
              <Link href="/profile">
                <button
                  onClick={() => setTab("profile")}
                  className="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-green-600 hover:bg-green-900"
                >
                  Sign In
                </button>
              </Link>
            )}
            {authState === AuthState.SignedIn && user && (
              <Link href="/profile">
                <span
                  onClick={() => setTab("profile")}
                  className={
                    tab === "profile"
                      ? "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  }
                >
                  {user.username}
                </span>
              </Link>
            )}
          </div>
        </div>
      </nav>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Component {...pageProps} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default MyApp;
