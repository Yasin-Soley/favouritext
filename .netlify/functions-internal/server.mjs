var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
};

// server-entry-module:@remix-run/dev/server-build
var server_build_exports = {};
__export(server_build_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  future: () => future,
  mode: () => mode,
  publicPath: () => publicPath,
  routes: () => routes
});

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsx } from "react/jsx-runtime";
var ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent")) ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  ErrorBoundary: () => ErrorBoundary,
  default: () => App,
  links: () => links,
  loader: () => loader
});
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError
} from "@remix-run/react";

// app/styles/style.css
var style_default = "/build/_assets/style-WRYHQ5DZ.css";

// app/data/auth.server.ts
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import pkg from "bcryptjs";

// app/data/database.server.js
import { PrismaClient } from "@prisma/client";
var prisma;
prisma = new PrismaClient(), prisma.$connect();

// app/utils/index.ts
var isCustomError = (obj) => !!obj.statusCode, CustomError = class extends Error {
  constructor(message, statusCode) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}, alphabets = function() {
  let alphabets2 = [];
  for (let i = 97; i <= 122; i++)
    alphabets2.push(String.fromCharCode(i));
  return alphabets2;
}();

// app/data/auth.server.ts
var sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: !0,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: !0
  }
}), USER_SESSION_KEY = "userId";
async function createUserSession(userId, redirectPath) {
  let session = await sessionStorage.getSession();
  return session.set(USER_SESSION_KEY, userId), redirect(redirectPath, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7
        // 7 days
      })
    }
  });
}
async function destroyUserSession(request) {
  let session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  });
}
async function requireUserSession(request) {
  let userId = await getUserFromSession(request);
  if (!userId)
    throw redirect("/auth?mode=login");
  return userId;
}
async function getUserFromSession(request) {
  let userId = (await sessionStorage.getSession(
    request.headers.get("Cookie")
  )).get("userId");
  return userId ? (console.log("passed"), userId) : null;
}
async function signup({ email, password, username }) {
  if (await prisma.user.findFirst({
    where: {
      email
    }
  }))
    throw new CustomError("\u06A9\u0627\u0631\u0628\u0631 \u0628\u0627 \u0627\u06CC\u0645\u06CC\u0644 \u0648\u0627\u0631\u062F \u0634\u062F\u0647 \u0627\u0632 \u0642\u0628\u0644 \u0648\u062C\u0648\u062F \u062F\u0627\u0631\u062F!", 422);
  let { hash } = pkg, passwordHash = await hash(password, 12), user = await prisma.user.create({
    data: {
      email,
      password: passwordHash,
      username
    }
  });
  return createUserSession(user.id, "/dictionary");
}
async function login({ email, password }) {
  let existingUser = await prisma.user.findFirst({
    where: {
      email
    }
  });
  if (!existingUser)
    throw new CustomError("\u0627\u06CC\u0645\u06CC\u0644 \u06CC\u0627 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0646\u0627\u062F\u0631\u0633\u062A \u0627\u0633\u062A.", 401);
  let { compare } = pkg;
  if (!await compare(password, existingUser.password))
    throw new CustomError("\u0627\u06CC\u0645\u06CC\u0644 \u06CC\u0627 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0646\u0627\u062F\u0631\u0633\u062A \u0627\u0633\u062A.", 401);
  return createUserSession(existingUser.id, "/dictionary");
}
async function getUsernameById(userId) {
  let user = await prisma.user.findFirst({ where: { id: userId } });
  if (!user)
    throw new CustomError("\u06A9\u0627\u0631\u0628\u0631 \u0628\u0627 \u0627\u06CC\u0645\u06CC\u0644 \u0648\u0627\u0631\u062F \u0634\u062F\u0647 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F!!", 404);
  return user.username;
}

// app/components/layout/MainNavigation.tsx
import { Form, Link as Link2, useRouteLoaderData } from "@remix-run/react";

// app/components/common/Button.tsx
import { Link } from "@remix-run/react";
import { jsx as jsx2 } from "react/jsx-runtime";
function Button({
  to,
  children,
  className,
  isButton,
  isLoading,
  type,
  preventScrollReset,
  onClick
}) {
  return className = "disabled:cursor-not-allowed disabled:bg-opacity-60 text-sm text-center rounded-sm " + className, isButton ? /* @__PURE__ */ jsx2(
    "button",
    {
      disabled: isLoading,
      type,
      className,
      onClick,
      children
    }
  ) : /* @__PURE__ */ jsx2("button", { disabled: isLoading, children: /* @__PURE__ */ jsx2(
    Link,
    {
      className,
      to,
      preventScrollReset,
      children
    }
  ) });
}

// app/components/layout/NavigateLink.tsx
import { NavLink } from "@remix-run/react";
import { jsx as jsx3 } from "react/jsx-runtime";
function NavigateLink({ to, children }) {
  return /* @__PURE__ */ jsx3(
    NavLink,
    {
      className: ({ isActive, isPending }) => isPending ? "block px-4 py-3 transition bg-main  text-green_dark animate-pulse rounded-t-sm" : isActive ? "block px-4 py-3 transition bg-main  text-green_dark rounded-t-sm" : "block px-4 py-3 transition hover:bg-main  hover:text-green_dark rounded-t-sm",
      to,
      children
    }
  );
}

// app/components/layout/MainNavigation.tsx
import { Fragment, jsx as jsx4, jsxs } from "react/jsx-runtime";
function MainNavigation() {
  let userId = useRouteLoaderData("root");
  return /* @__PURE__ */ jsx4("nav", { className: "px-14 pt-5", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
    /* @__PURE__ */ jsx4("div", { className: "px-8 py-1 text-xl font-bold", children: /* @__PURE__ */ jsx4(Link2, { className: "text-primary", to: "/", children: "\u0641\u06A9\u0631\u0646\u0648\u06CC\u0633" }) }),
    /* @__PURE__ */ jsx4("div", { className: "flex justify-center mx-auto", children: /* @__PURE__ */ jsxs("ul", { className: "flex text-main", children: [
      /* @__PURE__ */ jsx4("li", { children: /* @__PURE__ */ jsx4(NavigateLink, { to: "/poem", children: "\u06AF\u0646\u062C\u06CC\u0646\u0647 \u0627\u0634\u0639\u0627\u0631" }) }),
      /* @__PURE__ */ jsx4("li", { children: /* @__PURE__ */ jsx4(NavigateLink, { to: "/dictionary", children: "\u062F\u06CC\u06A9\u0634\u0646\u0631\u06CC \u0634\u062E\u0635\u06CC" }) }),
      /* @__PURE__ */ jsx4("li", { children: /* @__PURE__ */ jsx4(
        Link2,
        {
          className: "block px-4 py-3 transition hover:bg-main  hover:text-green_dark rounded-t-sm",
          to: "#footer",
          children: "\u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0627\u0632\u0646\u062F\u0647"
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx4("div", { className: "gap-x-2", children: userId ? /* @__PURE__ */ jsx4("div", { className: "flex flex-col justify-center ", children: /* @__PURE__ */ jsx4(Form, { action: "/logout", method: "DELETE", children: /* @__PURE__ */ jsx4(
      Button,
      {
        className: "bg-main w-24 py-2 inline-block ",
        isButton: !0,
        children: "\u062E\u0631\u0648\u062C"
      }
    ) }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx4(
        Button,
        {
          className: "bg-main border-l-2 border-secondary rounded-tl-none rounded-bl-none w-24 py-2  inline-block ",
          to: "/auth?mode=login",
          children: "\u0648\u0631\u0648\u062F"
        }
      ),
      /* @__PURE__ */ jsx4(
        Button,
        {
          className: "bg-main  rounded-tr-none rounded-br-none w-24 py-2  inline-block ",
          to: "/auth?mode=signup",
          children: "\u062B\u0628\u062A\u200C\u0646\u0627\u0645"
        }
      )
    ] }) })
  ] }) });
}

// app/components/layout/Footer.tsx
import { Link as Link3 } from "@remix-run/react";

// app/components/common/Seperator.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
function Separator() {
  return /* @__PURE__ */ jsx5("div", { className: "bg-primary w-3/5 mx-auto h-[1px] my-6" });
}

// app/components/common/icons/ChevronLeft.tsx
import { jsx as jsx6 } from "react/jsx-runtime";
function ChevronLeft() {
  return /* @__PURE__ */ jsx6(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      strokeWidth: 2,
      stroke: "currentColor",
      className: "w-5 h-5",
      children: /* @__PURE__ */ jsx6(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
        }
      )
    }
  );
}

// app/imgs/footer-icon-2.png
var footer_icon_2_default = "/build/_assets/footer-icon-2-EJ6TDTJW.png";

// app/imgs/footer-icon-3.png
var footer_icon_3_default = "/build/_assets/footer-icon-3-WVDGEPFG.png";

// app/imgs/footer-icon-1.png
var footer_icon_1_default = "/build/_assets/footer-icon-1-IUK4HCDQ.png";

// app/imgs/icon-instagram.png
var icon_instagram_default = "/build/_assets/icon-instagram-C7HUYRJE.png";

// app/imgs/icon-telegram.png
var icon_telegram_default = "/build/_assets/icon-telegram-7WT4IOQL.png";

// app/imgs/icon-facebook.png
var icon_facebook_default = "/build/_assets/icon-facebook-GCX7MZ6N.png";

// app/imgs/icon-skype.png
var icon_skype_default = "/build/_assets/icon-skype-MTEZZ7AU.png";

// app/components/layout/Footer.tsx
import { jsx as jsx7, jsxs as jsxs2 } from "react/jsx-runtime";
function Footer() {
  return /* @__PURE__ */ jsxs2("footer", { className: "bg-green_dark text-primary", id: "footer", children: [
    /* @__PURE__ */ jsxs2("div", { className: "flex", children: [
      /* @__PURE__ */ jsxs2("div", { className: "w-1/2 pt-10 pb-4", children: [
        /* @__PURE__ */ jsxs2("div", { className: "flex justify-center gap-x-8 text-lg", children: [
          /* @__PURE__ */ jsxs2("figure", { className: "flex flex-col items-center gap-y-4", children: [
            /* @__PURE__ */ jsx7(
              "img",
              {
                src: footer_icon_2_default,
                alt: "trust-worthy",
                className: "w-16 h-16"
              }
            ),
            /* @__PURE__ */ jsx7("figcaption", { children: "\u062D\u0641\u0638 \u062F\u0631\u062E\u062A\u0627\u0646" })
          ] }),
          /* @__PURE__ */ jsxs2("figure", { className: "flex flex-col items-center gap-y-4", children: [
            /* @__PURE__ */ jsx7(
              "img",
              {
                src: footer_icon_3_default,
                alt: "quick",
                className: "w-16 h-16"
              }
            ),
            /* @__PURE__ */ jsx7("figcaption", { children: "\u0633\u0631\u06CC\u0639" })
          ] }),
          /* @__PURE__ */ jsxs2("figure", { className: "flex flex-col items-center gap-y-4", children: [
            /* @__PURE__ */ jsx7(
              "img",
              {
                src: footer_icon_1_default,
                alt: "saving trees",
                className: "w-16 h-16"
              }
            ),
            /* @__PURE__ */ jsx7("figcaption", { children: "\u0645\u0637\u0645\u0626\u0646" })
          ] })
        ] }),
        /* @__PURE__ */ jsx7(Separator, {}),
        /* @__PURE__ */ jsxs2("div", { className: "flex gap-x-8 justify-center", children: [
          /* @__PURE__ */ jsxs2("div", { children: [
            /* @__PURE__ */ jsxs2("h4", { className: "flex gap-x-2 font-bold items-center", children: [
              /* @__PURE__ */ jsx7(ChevronLeft, {}),
              "\u062F\u0633\u062A\u0631\u0633\u06CC \u0633\u0631\u06CC\u0639"
            ] }),
            /* @__PURE__ */ jsxs2("ul", { className: "flex flex-col gap-y-3 pr-7 mt-5 text-sm", children: [
              /* @__PURE__ */ jsx7("li", { children: /* @__PURE__ */ jsx7(Link3, { to: "/poem", children: "\u0634\u0639\u0631" }) }),
              /* @__PURE__ */ jsx7("li", { children: /* @__PURE__ */ jsx7(Link3, { to: "/dictionary", children: "\u062F\u06CC\u06A9\u0634\u0646\u0631\u06CC" }) }),
              /* @__PURE__ */ jsx7("li", { children: /* @__PURE__ */ jsx7(Link3, { to: "/dictionary", children: "\u062F\u06CC\u06A9\u0634\u0646\u0631\u06CC" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs2("div", { children: [
            /* @__PURE__ */ jsxs2("h4", { className: "flex gap-x-2 font-bold items-center", children: [
              /* @__PURE__ */ jsx7(ChevronLeft, {}),
              "\u062A\u0645\u0627\u0633 \u0628\u0627 \u0645\u0627"
            ] }),
            /* @__PURE__ */ jsxs2("ul", { className: "flex flex-col gap-y-3 pr-7 mt-5 text-sm", children: [
              /* @__PURE__ */ jsx7("li", { children: /* @__PURE__ */ jsx7(Link3, { to: "#", children: "\u0627\u06CC\u0645\u06CC\u0644" }) }),
              /* @__PURE__ */ jsx7("li", { children: /* @__PURE__ */ jsx7(Link3, { to: "#", children: "\u062A\u0644\u06AF\u0631\u0627\u0645" }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx7(Separator, {}),
        /* @__PURE__ */ jsx7("div", { className: "flex justify-center items-center", children: /* @__PURE__ */ jsxs2("ul", { className: "flex gap-x-5 h-9", children: [
          /* @__PURE__ */ jsx7("li", { children: /* @__PURE__ */ jsx7(Link3, { to: "#", children: /* @__PURE__ */ jsx7(
            "img",
            {
              className: "block h-full object-cover",
              src: icon_instagram_default,
              alt: "social media - instagram"
            }
          ) }) }),
          /* @__PURE__ */ jsx7("li", { children: /* @__PURE__ */ jsx7(Link3, { to: "#", children: /* @__PURE__ */ jsx7(
            "img",
            {
              className: "block h-full object-cover",
              src: icon_telegram_default,
              alt: "social media - telegram"
            }
          ) }) }),
          /* @__PURE__ */ jsx7("li", { children: /* @__PURE__ */ jsx7(Link3, { to: "#", children: /* @__PURE__ */ jsx7(
            "img",
            {
              className: "block h-full object-cover",
              src: icon_facebook_default,
              alt: "social media - facebook"
            }
          ) }) }),
          /* @__PURE__ */ jsx7("li", { children: /* @__PURE__ */ jsx7(Link3, { to: "#", children: /* @__PURE__ */ jsx7(
            "img",
            {
              className: "block h-full object-cover",
              src: icon_skype_default,
              alt: "social media - skype"
            }
          ) }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx7("div", { className: "w-1/2 bg-footer bg-cover" })
    ] }),
    /* @__PURE__ */ jsx7("p", { className: "bg-cWhite py-3 text-green_dark text-center", children: "\xA9 \u06A9\u0644\u06CC\u0647 \u062D\u0642\u0648\u0642 \u0627\u06CC\u0646 \u0648\u0628 \u0633\u0627\u06CC\u062A \u0645\u062A\u0639\u0644\u0642 \u0628\u0647 \u0633\u0627\u0632\u0646\u062F\u06AF\u0627\u0646 \u0622\u0646 \u0627\u0633\u062A." })
  ] });
}

// app/root.tsx
import { jsx as jsx8, jsxs as jsxs3 } from "react/jsx-runtime";
var links = () => [
  { rel: "stylesheet", href: style_default }
], loader = async ({ request }) => {
  let userId = await getUserFromSession(request);
  return console.log("root.tsx: ", userId), userId;
};
function App() {
  return /* @__PURE__ */ jsxs3("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs3("head", { children: [
      /* @__PURE__ */ jsx8("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx8(
        "meta",
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1"
        }
      ),
      /* @__PURE__ */ jsx8(Meta, {}),
      /* @__PURE__ */ jsx8(Links, {})
    ] }),
    /* @__PURE__ */ jsxs3(
      "body",
      {
        dir: "rtl",
        className: "bg-main text-green_dark relative",
        style: {},
        id: "root",
        children: [
          /* @__PURE__ */ jsx8(Outlet, {}),
          /* @__PURE__ */ jsx8(Footer, {}),
          /* @__PURE__ */ jsx8(ScrollRestoration, {}),
          /* @__PURE__ */ jsx8(Scripts, {}),
          /* @__PURE__ */ jsx8(LiveReload, {})
        ]
      }
    )
  ] });
}
function ErrorBoundary() {
  let error = useRouteError();
  return console.error(error), /* @__PURE__ */ jsxs3("html", { children: [
    /* @__PURE__ */ jsxs3("head", { children: [
      /* @__PURE__ */ jsx8("title", { children: "Oh no!" }),
      /* @__PURE__ */ jsx8(Meta, {}),
      /* @__PURE__ */ jsx8(Links, {})
    ] }),
    /* @__PURE__ */ jsxs3(
      "body",
      {
        dir: "rtl",
        className: "bg-main text-green_dark relative",
        style: { fontFamily: "B Roya" },
        children: [
          /* @__PURE__ */ jsx8("header", { className: "bg-secondary", children: /* @__PURE__ */ jsx8(MainNavigation, {}) }),
          /* @__PURE__ */ jsx8("h1", { className: "text-center text-2xl  font-bold mt-16", children: isRouteErrorResponse(error) ? error.data : error instanceof Error ? error.message : "something went wrong" }),
          /* @__PURE__ */ jsx8("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsx8(
            Button,
            {
              to: "/",
              className: "border-b-2 border-green_dark px-2 py-1 text-xl hover:bg-green_dark hover:text-primary transition-colors",
              children: "\u0628\u0627\u0632\u06AF\u0634\u062A \u0628\u0647 \u0635\u0641\u062D\u0647 \u0627\u0635\u0644\u06CC"
            }
          ) }),
          /* @__PURE__ */ jsx8(Scripts, {})
        ]
      }
    )
  ] });
}

// app/routes/_app.dictionary.$id.delete.tsx
var app_dictionary_id_delete_exports = {};
__export(app_dictionary_id_delete_exports, {
  action: () => action,
  default: () => DeleteWordPage,
  loader: () => loader2
});
import {
  json,
  redirect as redirect2
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// app/data/word.server.ts
async function getAllWords(userId) {
  let wordsList = await prisma.word.findMany({
    where: {
      userId
    }
  });
  if (!wordsList)
    throw new Error("\u062F\u0631\u06CC\u0627\u0641\u062A \u0644\u06CC\u0633\u062A \u0648\u0627\u0698\u06AF\u0627\u0646 \u0628\u0627 \u062E\u0637\u0627 \u0645\u0648\u0627\u062C\u0647 \u0634\u062F. \u062F\u0648\u0628\u0627\u0631\u0647 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F.");
  return wordsList;
}
async function addWord(word, userId) {
  let user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user)
    throw Error("\u0628\u0631\u0627\u06CC \u0627\u0641\u0632\u0648\u062F\u0646 \u0634\u0639\u0631 \u0628\u0627\u06CC\u062F \u0627\u0628\u062A\u062F\u0627 \u0648\u0627\u0631\u062F \u062D\u0633\u0627\u0628 \u06A9\u0627\u0631\u0628\u0631\u06CC \u062E\u0648\u062F \u0634\u0648\u06CC\u062F.");
  let newWord = await prisma.word.create({
    data: {
      user: {
        connect: {
          id: user.id
        }
      },
      word: word.word,
      meanings: word.meanings,
      definitions: word.definitions,
      examples: word.examples,
      appearance: word.appearances
    }
  });
  if (!newWord)
    throw new CustomError("\u0639\u0645\u0644\u06CC\u0627\u062A \u0628\u0627 \u062E\u0637\u0627 \u0645\u0648\u0627\u062C\u0647 \u0634\u062F. \u062F\u0648\u0628\u0627\u0631\u0647 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F.", 401);
  return newWord;
}
async function getWordById(wordId) {
  let word = await prisma.word.findUnique({
    where: {
      id: wordId
    }
  });
  if (!word)
    throw Error("\u0648\u0627\u0698\u0647 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  return word;
}
async function deleteWord(wordId) {
  if (!await prisma.word.findUnique({
    where: { id: wordId }
  }))
    throw Error("\u0648\u0627\u0698\u06C0 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F!");
  let result = await prisma.$transaction([
    prisma.word.delete({
      where: {
        id: wordId
      }
    })
  ]);
  return console.log("result", result), result;
}
async function updateWord(word, wordId) {
  let existingWord = await prisma.word.findUnique({
    where: { id: wordId }
  });
  if (!existingWord)
    throw Error("\u0648\u0627\u0698\u06C0 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F!");
  let updatedWord = await prisma.word.update({
    where: {
      id: wordId
    },
    data: {
      user: {
        connect: {
          id: existingWord.userId
        }
      },
      word: word.word,
      meanings: word.meanings,
      definitions: word.definitions,
      examples: word.examples,
      appearance: word.appearances
    }
  });
  if (!updatedWord)
    throw new CustomError("\u0639\u0645\u0644\u06CC\u0627\u062A \u0628\u0627 \u062E\u0637\u0627 \u0645\u0648\u0627\u062C\u0647 \u0634\u062F. \u062F\u0648\u0628\u0627\u0631\u0647 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F.", 401);
  return updatedWord;
}

// app/components/pages/dictionary/DeleteWordModal.tsx
import { Form as Form2, Link as Link4, useNavigate } from "@remix-run/react";

// app/components/common/Modal.tsx
import { jsx as jsx9 } from "react/jsx-runtime";
function Modal({ children }) {
  return /* @__PURE__ */ jsx9(
    "div",
    {
      className: "bg-primary text-green_dark py-10 px-8 rounded-sm",
      onClick: (e) => e.stopPropagation(),
      children
    }
  );
}

// app/components/common/Overlay.tsx
import { createPortal } from "react-dom";
import { Fragment as Fragment2, jsx as jsx10 } from "react/jsx-runtime";
function Overlay({ onClick, children }) {
  let root = document.getElementById("root");
  return root ? createPortal(
    /* @__PURE__ */ jsx10(Fragment2, { children: /* @__PURE__ */ jsx10(
      "div",
      {
        className: "fixed top-0 left-0 z-50 bg-black bg-opacity-40 w-screen h-screen flex justify-center items-center",
        onClick,
        children
      }
    ) }),
    root
  ) : null;
}

// app/components/pages/dictionary/DeleteWordModal.tsx
import { jsx as jsx11, jsxs as jsxs4 } from "react/jsx-runtime";
function DeleteWordModal({
  username,
  word,
  wordId
}) {
  let navigate = useNavigate(), handleModalClose = () => {
    navigate("/dictionary", { preventScrollReset: !0 });
  };
  return /* @__PURE__ */ jsx11(Overlay, { onClick: handleModalClose, children: /* @__PURE__ */ jsxs4(Modal, { children: [
    /* @__PURE__ */ jsxs4("p", { children: [
      username,
      " \u0639\u0632\u06CC\u0632\u060C \u0634\u0645\u0627 \u062F\u0631 \u062D\u0627\u0644 \u062D\u0630\u0641 \u06A9\u0631\u062F\u0646 \u0648\u0627\u0698\u0647\u200C\u06CC",
      /* @__PURE__ */ jsx11(
        Link4,
        {
          className: "font-bold border-b-2 border-b-green_dark rounded-sm mx-3 pb-1",
          to: `/dictionary/#${wordId}`,
          children: word
        }
      ),
      " ",
      "\u0647\u0633\u062A\u06CC\u062F."
    ] }),
    /* @__PURE__ */ jsx11("p", { className: "mt-2", children: "\u0622\u06CC\u0627 \u0645\u0637\u0645\u0626\u0646\u06CC\u062F\u061F" }),
    /* @__PURE__ */ jsxs4("div", { className: "flex justify-center gap-x-4 mt-5", children: [
      /* @__PURE__ */ jsx11(
        Button,
        {
          className: "bg-green_dark text-primary w-24 px-4 py-2",
          isButton: !0,
          onClick: handleModalClose,
          children: "\u0628\u0627\u0632\u06AF\u0634\u062A"
        }
      ),
      /* @__PURE__ */ jsx11(Form2, { method: "DELETE", children: /* @__PURE__ */ jsx11(
        Button,
        {
          className: "bg-red-400 hover:bg-red-500 transition-colors text-primary w-24 px-4 py-2",
          type: "submit",
          isButton: !0,
          children: "\u0628\u0644\u0647"
        }
      ) })
    ] })
  ] }) });
}

// app/routes/_app.dictionary.$id.delete.tsx
import { jsx as jsx12 } from "react/jsx-runtime";
var loader2 = async ({ request, params }) => {
  let userId = await getUserFromSession(request), username = await getUsernameById(userId), word = await getWordById(params.id);
  return { username, word };
};
function DeleteWordPage() {
  let { username, word } = useLoaderData();
  return /* @__PURE__ */ jsx12(
    DeleteWordModal,
    {
      username,
      word: word.word,
      wordId: word.id
    }
  );
}
var action = async ({ request, params }) => {
  if (request.method !== "DELETE")
    throw json({ message: "\u0646\u0648\u0639 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A." }, { status: 400 });
  if (!params.id)
    throw json({ message: "\u0648\u0627\u0698\u06C0 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F. \u0645\u062C\u062F\u062F\u0627 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F." });
  try {
    await deleteWord(params.id);
  } catch (error) {
    return error;
  }
  return redirect2("/dictionary");
};

// app/routes/_app.dictionary_.$id.tsx
var app_dictionary_id_exports = {};
__export(app_dictionary_id_exports, {
  action: () => action2,
  default: () => EditWordPage,
  loader: () => loader3
});

// app/components/pages/dictionary/WordForm.tsx
import {
  Form as Form3,
  Link as Link5,
  useActionData,
  useNavigation,
  useSubmit
} from "@remix-run/react";
import { useRef, useState } from "react";
import {
  PlusCircleIcon,
  PlusIcon,
  XCircleIcon
} from "@heroicons/react/24/solid";
import { jsx as jsx13, jsxs as jsxs5 } from "react/jsx-runtime";
function WordForm({ wordData }) {
  let defaultValues;
  wordData ? defaultValues = {
    word: wordData.word,
    meanings: wordData.meanings,
    definitions: wordData.definitions,
    examples: wordData.examples,
    appearances: wordData.appearance
  } : defaultValues = {
    word: "",
    meanings: [],
    definitions: [""],
    examples: [""],
    appearances: [""]
  };
  let [word, setWord] = useState(defaultValues.word), [meanings, setMeanings] = useState(defaultValues.meanings), [meaningInput, setMeaningInput] = useState(""), [definitions, setDefinitions] = useState(defaultValues.definitions), [examples, setExamples] = useState(defaultValues.examples), [appearances, setAppearances] = useState(defaultValues.appearances), validationErrors = useActionData(), meanInputRef = useRef(null), submit = useSubmit(), navigation = useNavigation(), handleWordChange = (word2) => setWord(word2), deleteMeaning = (index) => {
    let newMeanings = [...meanings];
    newMeanings.splice(index, 1), setMeanings(newMeanings);
  }, handleMeanInputChange = (value) => setMeaningInput(value), handleMeanInputKeyDown = (e) => {
    e.key === "Enter" && (e.preventDefault(), addMeaning());
  }, addMeaning = () => {
    let meaningExists = meanings.includes(meaningInput), passedLimitCount = meanings.length === 3;
    meaningInput.trim() !== "" && !meaningExists && !passedLimitCount && (setMeanings((prevMeans) => [...prevMeans, meaningInput.trim()]), setMeaningInput(""), meanInputRef.current?.focus());
  }, handleSharedInputChange = (type, i, value) => {
    if (type === "def") {
      let defs = [...definitions];
      defs[i] = value, setDefinitions(defs);
    } else if (type === "exam") {
      let exams = [...examples];
      exams[i] = value, setExamples(exams);
    } else {
      let newApps = [...appearances];
      newApps[i] = value, setAppearances(newApps);
    }
  }, addDefLine = () => setDefinitions((prevState) => [...prevState, ""]), addExampleLine = () => setExamples((prevState) => [...prevState, ""]), addAppearanceLine = () => setAppearances((prevState) => [...prevState, ""]), deleteLineShared = (index, type) => {
    if (type === "def") {
      let newLines = [...definitions];
      newLines.splice(index, 1), setDefinitions(newLines);
    } else if (type === "exam") {
      let newLines = [...examples];
      newLines.splice(index, 1), setExamples(newLines);
    } else {
      let newLines = [...appearances];
      newLines.splice(index, 1), setAppearances(newLines);
    }
  };
  return /* @__PURE__ */ jsx13("div", { className: "w-3/5 flex flex-col", dir: "ltr", children: /* @__PURE__ */ jsxs5(
    Form3,
    {
      method: "POST",
      className: "rounded-sm overflow-hidden drop-shadow-md",
      onSubmit: (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append("word", word), formData.append("meanings", meanings.join("//")), formData.append(
          "definitions",
          definitions.filter((val) => val.trim() !== "").join("//")
        ), formData.append(
          "examples",
          examples.filter((val) => val.trim() !== "").join("//")
        ), formData.append(
          "appearances",
          appearances.filter((val) => val.trim() !== "").join("//")
        ), submit(formData, {
          method: wordData ? "PUT" : "POST",
          action: wordData ? `/dictionary/${wordData.id}` : "/dictionary/add"
        });
      },
      children: [
        /* @__PURE__ */ jsxs5("div", { className: "py-4 px-6 flex bg-green_dark text-primary", children: [
          /* @__PURE__ */ jsx13(
            "input",
            {
              className: "mr-auto outline-none bg-transparent placeholder:text-primary border-b border-primary pb-1 w-1/4",
              type: "text",
              placeholder: "word",
              value: word,
              onChange: (e) => handleWordChange(e.target.value)
            }
          ),
          meanings.length > 0 && /* @__PURE__ */ jsx13("p", { className: "flex gap-x-1 text-xs", children: meanings.map((meaning, index) => /* @__PURE__ */ jsxs5(
            "span",
            {
              className: "block relative rounded-sm bg-primary text-green_dark p-1",
              children: [
                /* @__PURE__ */ jsx13("span", { className: "", children: meaning }),
                /* @__PURE__ */ jsx13(
                  "button",
                  {
                    type: "button",
                    onClick: () => deleteMeaning(index),
                    className: "mr-1 text-red-500 absolute left-full bottom-full transform -translate-x-1/2 translate-y-1/2",
                    children: /* @__PURE__ */ jsx13(XCircleIcon, { className: "w-4" })
                  }
                )
              ]
            },
            index
          )) }),
          /* @__PURE__ */ jsxs5("div", { className: "w-1/5 relative ml-5", children: [
            /* @__PURE__ */ jsx13(
              "input",
              {
                dir: "rtl",
                className: "text-sm outline-none bg-transparent placeholder:text-primary  placeholder:text-sm border-b border-primary pb-1 w-full",
                type: "text",
                placeholder: "\u0645\u0639\u0646\u06CC\u200C(\u0647\u0627)",
                value: meaningInput,
                onChange: (e) => handleMeanInputChange(e.target.value),
                onKeyDown: handleMeanInputKeyDown,
                ref: meanInputRef
              }
            ),
            /* @__PURE__ */ jsx13(
              "button",
              {
                type: "button",
                onClick: addMeaning,
                className: "text-primary absolute left-0 top-1/2 transform -translate-y-1/2",
                children: /* @__PURE__ */ jsx13(PlusCircleIcon, { className: "w-5" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs5("div", { className: "px-6 py-10 bg-green_light flex flex-col", children: [
          /* @__PURE__ */ jsxs5("div", { children: [
            /* @__PURE__ */ jsxs5("h3", { className: "flex items-center gap-x-4 font-bold text-lg mb-4", children: [
              /* @__PURE__ */ jsxs5(
                "button",
                {
                  type: "button",
                  onClick: addDefLine,
                  className: "font-normal flex gap-x-2 items-center bg-green_dark text-primary py-2 px-4 rounded-sm text-xs",
                  children: [
                    /* @__PURE__ */ jsx13(PlusIcon, { className: "font-bold w-4 rounded-full text-green_dark bg-primary" }),
                    /* @__PURE__ */ jsx13("span", { className: "", children: "add" })
                  ]
                }
              ),
              "Definition:"
            ] }),
            definitions.map((def, index) => /* @__PURE__ */ jsxs5("div", { className: "w-3/4 ml-24 relative", children: [
              /* @__PURE__ */ jsx13(
                "input",
                {
                  type: "text",
                  value: def,
                  onChange: (e) => handleSharedInputChange(
                    "def",
                    index,
                    e.target.value
                  ),
                  placeholder: `${index + 1}. type your definition here`,
                  className: "outline-none bg-transparent placeholder:text-green_dark placeholder:text-sm placeholder:text-opacity-60 border-b-2 border-green_dark text-green_dark pb-1 flex-1 w-full mb-2"
                },
                index
              ),
              /* @__PURE__ */ jsx13(
                "button",
                {
                  type: "button",
                  className: "absolute right-0",
                  onClick: deleteLineShared.bind(
                    null,
                    index,
                    "def"
                  ),
                  children: /* @__PURE__ */ jsx13(XCircleIcon, { className: "w-4 text-red-400" })
                }
              )
            ] }, index))
          ] }),
          /* @__PURE__ */ jsxs5("div", { className: "my-8", children: [
            /* @__PURE__ */ jsxs5("h3", { className: "flex items-center gap-x-4 font-bold text-lg mb-4", children: [
              /* @__PURE__ */ jsxs5(
                "button",
                {
                  type: "button",
                  onClick: addExampleLine,
                  className: "font-normal flex gap-x-2 items-center bg-green_dark text-primary py-2 px-4 rounded-sm text-xs",
                  children: [
                    /* @__PURE__ */ jsx13(PlusIcon, { className: "font-bold w-4 rounded-full text-green_dark bg-primary" }),
                    /* @__PURE__ */ jsx13("span", { className: "", children: "add" })
                  ]
                }
              ),
              "Example(s):"
            ] }),
            examples.map((example, index) => /* @__PURE__ */ jsxs5("div", { className: "w-3/4 ml-24 relative", children: [
              /* @__PURE__ */ jsx13(
                "input",
                {
                  type: "text",
                  value: example,
                  onChange: (e) => handleSharedInputChange(
                    "exam",
                    index,
                    e.target.value
                  ),
                  placeholder: `${index + 1}. type your example here`,
                  className: "outline-none bg-transparent placeholder:text-green_dark placeholder:text-opacity-60 placeholder:text-sm border-b-2 border-green_dark text-green_dark pb-1 flex-1  w-full mb-2"
                }
              ),
              /* @__PURE__ */ jsx13(
                "button",
                {
                  type: "button",
                  className: "absolute right-0",
                  onClick: deleteLineShared.bind(
                    null,
                    index,
                    "exam"
                  ),
                  children: /* @__PURE__ */ jsx13(XCircleIcon, { className: "w-4 text-red-400" })
                }
              )
            ] }, index))
          ] }),
          /* @__PURE__ */ jsxs5("div", { children: [
            /* @__PURE__ */ jsxs5("h3", { className: "flex items-center gap-x-4 font-bold text-lg mb-4", children: [
              /* @__PURE__ */ jsxs5(
                "button",
                {
                  type: "button",
                  onClick: addAppearanceLine,
                  className: "font-normal flex gap-x-2 items-center bg-green_dark text-primary py-2 px-4 rounded-sm text-xs",
                  children: [
                    /* @__PURE__ */ jsx13(PlusIcon, { className: "font-bold w-4 rounded-full text-green_dark bg-primary" }),
                    /* @__PURE__ */ jsx13("span", { className: "", children: "add" })
                  ]
                }
              ),
              "Where have I seen?"
            ] }),
            appearances.map((appearance, index) => /* @__PURE__ */ jsxs5("div", { className: "w-3/4 ml-24 relative", children: [
              /* @__PURE__ */ jsx13(
                "input",
                {
                  type: "text",
                  value: appearance,
                  onChange: (e) => handleSharedInputChange(
                    "appearance",
                    index,
                    e.target.value
                  ),
                  placeholder: `${index + 1}. type where you see the word `,
                  className: "outline-none bg-transparent placeholder:text-green_dark placeholder:text-opacity-60 placeholder:text-sm border-b-2 border-green_dark text-green_dark pb-1 flex-1  w-full mb-2"
                }
              ),
              /* @__PURE__ */ jsx13(
                "button",
                {
                  type: "button",
                  className: "absolute right-0",
                  onClick: deleteLineShared.bind(
                    null,
                    index,
                    "appearance"
                  ),
                  children: /* @__PURE__ */ jsx13(XCircleIcon, { className: "w-4 text-red-400" })
                }
              )
            ] }, index))
          ] }),
          validationErrors && /* @__PURE__ */ jsx13("ul", { className: "my-4", dir: "rtl", children: Object.values(validationErrors).map((error, i) => /* @__PURE__ */ jsxs5(
            "li",
            {
              className: "text-red-600 text-sm w-3/4 mb-1",
              children: [
                i + 1,
                ".",
                " ",
                typeof error == "string" && error
              ]
            },
            i
          )) }),
          /* @__PURE__ */ jsxs5("div", { className: "mt-10 flex flex-col gap-y-3 items-center", children: [
            /* @__PURE__ */ jsx13(
              Button,
              {
                isButton: !0,
                isLoading: navigation.state !== "idle",
                type: "submit",
                className: "bg-green_dark text-primary w-44 py-2 rounded-sm",
                children: "\u062A\u0627\u06CC\u06CC\u062F"
              }
            ),
            /* @__PURE__ */ jsx13(
              Link5,
              {
                className: "text-xs pb-1 border-b border-green_dark",
                to: "/dictionary",
                children: "\u0628\u0627\u0632\u06AF\u0634\u062A \u0628\u0647 \u062F\u06CC\u06A9\u0634\u0646\u0631\u06CC"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}

// app/data/validate.server.ts
function isValidEmail(value) {
  return value && value.includes("@") && value.includes(".com");
}
function isValidPassword(value) {
  return value && value.trim().length >= 5 && value.trim().length <= 10;
}
function isValidRepeatedPassword(value, password) {
  return value && value === password;
}
function validateCredentials(input) {
  let validationErrors = {};
  if (typeof input.email == "string" && !isValidEmail(input.email) && (validationErrors.email = "\u0622\u062F\u0631\u0633 \u0627\u06CC\u0645\u06CC\u0644 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A."), typeof input.password == "string" && !isValidPassword(input.password) && (validationErrors.password = "\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A. \u0628\u0627\u06CC\u062F \u0628\u06CC\u0646 5 \u062A\u0627 10 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0628\u0627\u0634\u062F. "), typeof input.repeatedPassword == "string" && !isValidRepeatedPassword(input.repeatedPassword, input.password) && (validationErrors.repeatedPassword = "\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0628\u0627 \u062A\u06A9\u0631\u0627\u0631 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u062A\u0637\u0627\u0628\u0642 \u0646\u062F\u0627\u0631\u062F."), console.log(validationErrors), Object.keys(validationErrors).length > 0)
    throw validationErrors;
  return {
    email: input.email,
    password: input.password,
    username: input.username
  };
}
function isValidPoet(value) {
  return value && value.trim().length >= 0 && value.trim().length <= 22;
}
function isValidAlias(value) {
  return value && value.trim().length >= 0 && value.trim().length <= 20;
}
function isValidTags(value) {
  return value[0] && value.length <= 5;
}
function isNotValidLines(value) {
  let index;
  for (let lineNumber in value) {
    if (!value[+lineNumber].p1.trim()) {
      index = { lineNumber: +lineNumber, part: "p1" };
      break;
    }
    if (!value[+lineNumber].p2.trim()) {
      index = { lineNumber: +lineNumber, part: "p2" };
      break;
    }
  }
  return index;
}
function validatePoemData({ poet, tags, lines, alias }) {
  let poemDataErrors = {};
  typeof poet == "string" && !isValidPoet(poet) && (poemDataErrors.poet = "\u0646\u0627\u0645 \u0634\u0627\u0639\u0631 \u0631\u0627 \u0645\u062C\u062F\u062F\u0627 \u0628\u0631\u0631\u0633\u06CC \u06A9\u0646\u06CC\u062F!"), typeof alias == "string" && !isValidAlias(alias) && (poemDataErrors.alias = "\u0646\u0627\u0645 \u0627\u0646\u062A\u062E\u0627\u0628\u06CC \u0634\u0639\u0631 \u0631\u0627 \u0645\u062C\u062F\u062F\u0627 \u0628\u0631\u0631\u0633\u06CC \u06A9\u0646\u06CC\u062F!");
  let modifiedTags = tags.split(",");
  typeof tags == "string" && !isValidTags(modifiedTags) && (poemDataErrors.tags = "\u0628\u0631\u0686\u0633\u0628 \u0647\u0627 \u0631\u0627 \u0645\u062C\u062F\u062F\u0627 \u0628\u0631\u0631\u0633\u06CC \u06A9\u0646\u06CC\u062F. \u062D\u062F\u0627\u0642\u0644 1 \u0648 \u062D\u062F\u0627\u06A9\u062B\u0631 5 \u0628\u0631\u0686\u0633\u0628 \u0627\u0636\u0627\u0641\u0647 \u06A9\u0646\u06CC\u062F!");
  let splitMonostich = lines.split("/").map((line) => {
    let obj = {};
    return obj.p1 = line.split(",")[0], obj.p2 = line.split(",")[1], obj;
  });
  isNotValidLines(splitMonostich) && (poemDataErrors.lines = isNotValidLines(splitMonostich));
  let verifiedData = {
    poet,
    alias,
    tags: modifiedTags,
    lines: splitMonostich
  };
  if (Object.keys(poemDataErrors).length > 0)
    throw poemDataErrors;
  return verifiedData;
}
function isValidWord(value) {
  return value && value.trim().length >= 1 && value.trim().length <= 19;
}
function isValidMeanings(value) {
  return value[0] && value.length >= 1 && !value.includes("");
}
function isValidSentences(value) {
  return value[0] && value.length >= 1 && !value.includes("");
}
function validateWordData({
  word,
  meanings,
  definitions,
  examples,
  appearances
}) {
  let wordDataErrors = {};
  typeof word == "string" && !isValidWord(word) && (wordDataErrors.word = "\u0648\u0627\u0698\u0647 \u0631\u0627 \u0645\u062C\u062F\u062F\u0627 \u0628\u0631\u0631\u0633\u06CC \u06A9\u0646\u06CC\u062F!");
  let modifiedMeanings = meanings.split("//");
  isValidMeanings(modifiedMeanings) || (wordDataErrors.meanings = "\u0645\u0639\u0646\u06CC(\u0647\u0627) \u0631\u0627 \u0645\u062C\u062F\u062F\u0627 \u0628\u0631\u0631\u0633\u06CC \u06A9\u0646\u06CC\u062F!");
  let modifiedDefinitions = definitions.split("//");
  isValidSentences(modifiedDefinitions) || (wordDataErrors.definitions = "\u062A\u0639\u0627\u0631\u06CC\u0641 \u0631\u0627 \u0645\u062C\u062F\u062F\u0627 \u0628\u0631\u0631\u0633\u06CC \u06A9\u0646\u06CC\u062F. \u062D\u062F\u0627\u0642\u0644 1 \u062A\u0639\u0631\u06CC\u0641 \u0627\u0636\u0627\u0641\u0647 \u06A9\u0646\u06CC\u062F.");
  let modifiedExamples = examples.split("//");
  isValidSentences(modifiedExamples) || (wordDataErrors.examples = "\u0645\u062B\u0627\u0644 \u0647\u0627 \u0631\u0627 \u0645\u062C\u062F\u062F\u0627 \u0628\u0631\u0631\u0633\u06CC \u06A9\u0646\u06CC\u062F. \u062D\u062F\u0627\u0642\u0644 1 \u0645\u062B\u0627\u0644 \u0627\u0636\u0627\u0641\u0647 \u06A9\u0646\u06CC\u062F!"), console.log(appearances);
  let modifiedAppearances = appearances.split("//");
  isValidSentences(modifiedAppearances) || (wordDataErrors.appearances = "\u0628\u0631\u0627\u06CC \u06CC\u0627\u062F\u0622\u0648\u0631\u06CC \u0648 \u062C\u0633\u062A\u062C\u0648\u0631\u06CC \u0628\u0647\u062A\u0631\u060C \u0627\u0636\u0627\u0641\u0647 \u06A9\u0646\u06CC\u062F \u06A9\u062C\u0627 \u06A9\u0644\u0645\u0647 \u0631\u0627 \u0645\u0634\u0627\u0647\u062F\u0647 \u06A9\u0631\u062F\u06CC\u062F. \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u06CC\u06A9 \u0645\u0642\u0627\u0644\u0647\u060C \u06A9\u062A\u0627\u0628\u060C \u060C \u0627\u067E\u06CC\u0632\u0648\u062F \u062E\u0627\u0635\u06CC \u0627\u0632 \u0633\u0631\u06CC\u0627\u0644 \u0648 ... \u0628\u0627\u0634\u062F");
  let verifiedData = {
    word,
    meanings: modifiedMeanings,
    definitions: modifiedDefinitions,
    examples: modifiedExamples,
    appearances: modifiedAppearances
  };
  if (Object.keys(wordDataErrors).length > 0)
    throw wordDataErrors;
  return verifiedData;
}

// app/routes/_app.dictionary_.$id.tsx
import {
  json as json2,
  redirect as redirect3
} from "@remix-run/node";
import { useLoaderData as useLoaderData2 } from "@remix-run/react";
import { jsx as jsx14, jsxs as jsxs6 } from "react/jsx-runtime";
var loader3 = async ({ request, params }) => {
  await requireUserSession(request);
  let wordId = params.id;
  return await getWordById(wordId);
};
function EditWordPage() {
  let wordData = useLoaderData2();
  return /* @__PURE__ */ jsxs6("main", { className: "my-10 flex flex-col items-center gap-y-8", children: [
    /* @__PURE__ */ jsx14("h2", { className: "text-xl font-bold", children: "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u0648\u0627\u0698\u0647" }),
    /* @__PURE__ */ jsx14(WordForm, { wordData })
  ] });
}
var action2 = async ({ request, params }) => {
  let wordId = params.id;
  if (request.method !== "PUT")
    throw json2({ message: "\u0646\u0648\u0639 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A." }, { status: 400 });
  if (!wordId)
    throw json2({ message: "\u0648\u0627\u0698\u06C0 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F. \u0645\u062C\u062F\u062F\u0627 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F." });
  let formData = await request.formData(), word = formData.get("word"), meanings = formData.get("meanings"), definitions = formData.get("definitions"), examples = formData.get("examples"), appearances = formData.get("appearances");
  try {
    let verifiedData = validateWordData({
      word,
      meanings,
      examples,
      definitions,
      appearances
    }), modifiedWord = await updateWord(verifiedData, wordId);
    return console.log(modifiedWord), redirect3("/dictionary");
  } catch (error) {
    return error;
  }
};

// app/routes/_app.dictionary_.add.tsx
var app_dictionary_add_exports = {};
__export(app_dictionary_add_exports, {
  action: () => action3,
  default: () => AddWordPage,
  loader: () => loader4,
  meta: () => meta
});
import {
  redirect as redirect4
} from "@remix-run/node";
import { jsx as jsx15, jsxs as jsxs7 } from "react/jsx-runtime";
var meta = () => [
  { title: "LOGO - Adding Word to Dictionary" },
  {
    name: "description",
    content: "This is where I store the words that are new, interesting or valuable to me."
  }
], loader4 = async ({ request }) => await requireUserSession(request);
function AddWordPage() {
  return /* @__PURE__ */ jsxs7("main", { className: "my-10 flex flex-col items-center gap-y-8", children: [
    /* @__PURE__ */ jsx15("h2", { className: "text-xl font-bold", children: "\u0627\u0641\u0632\u0648\u062F\u0646 \u0648\u0627\u0698\u0647" }),
    /* @__PURE__ */ jsx15(WordForm, {})
  ] });
}
var action3 = async ({ request }) => {
  let formData = await request.formData(), word = formData.get("word"), meanings = formData.get("meanings"), definitions = formData.get("definitions"), examples = formData.get("examples"), appearances = formData.get("appearances");
  console.log({
    word,
    meanings,
    examples,
    definitions,
    appearances
  });
  try {
    let verifiedData = validateWordData({
      word,
      meanings,
      examples,
      definitions,
      appearances
    }), userId = await getUserFromSession(request), addedWord;
    return userId && (addedWord = await addWord(verifiedData, userId)), console.log(addedWord), redirect4("/dictionary");
  } catch (error) {
    return error;
  }
};

// app/routes/_app.poem.$id.delete.tsx
var app_poem_id_delete_exports = {};
__export(app_poem_id_delete_exports, {
  action: () => action4,
  default: () => DeletePoemPage,
  loader: () => loader5,
  meta: () => meta2
});
import {
  json as json3,
  redirect as redirect5
} from "@remix-run/node";
import { useLoaderData as useLoaderData3, useMatches } from "@remix-run/react";

// app/components/pages/poem/DeletePoemModal.tsx
import { Form as Form4, Link as Link6, useNavigate as useNavigate2 } from "@remix-run/react";
import { Fragment as Fragment3, jsx as jsx16, jsxs as jsxs8 } from "react/jsx-runtime";
function DeletePoemModal({
  username,
  alias,
  poemId
}) {
  let navigate = useNavigate2(), handleModalClose = () => {
    navigate("/poem", { preventScrollReset: !0 });
  };
  return /* @__PURE__ */ jsx16(Fragment3, { children: /* @__PURE__ */ jsx16(Overlay, { onClick: handleModalClose, children: /* @__PURE__ */ jsxs8(Modal, { children: [
    /* @__PURE__ */ jsxs8("p", { children: [
      username,
      " \u0639\u0632\u06CC\u0632\u060C \u0634\u0645\u0627 \u062F\u0631 \u062D\u0627\u0644 \u062D\u0630\u0641 \u06A9\u0631\u062F\u0646 \u0634\u0639\u0631",
      /* @__PURE__ */ jsx16(
        Link6,
        {
          className: "font-bold border-b-2 border-b-green_dark rounded-sm mx-3 pb-1",
          to: `/poem/#${poemId}`,
          children: alias
        }
      ),
      " ",
      "\u0647\u0633\u062A\u06CC\u062F."
    ] }),
    /* @__PURE__ */ jsx16("p", { className: "mt-2", children: "\u0622\u06CC\u0627 \u0645\u0637\u0645\u0626\u0646\u06CC\u062F\u061F" }),
    /* @__PURE__ */ jsxs8("div", { className: "flex justify-center gap-x-4 mt-5", children: [
      /* @__PURE__ */ jsx16(
        Button,
        {
          className: "bg-green_dark text-primary w-24 px-4 py-2",
          isButton: !0,
          onClick: handleModalClose,
          children: "\u0628\u0627\u0632\u06AF\u0634\u062A"
        }
      ),
      /* @__PURE__ */ jsx16(Form4, { method: "DELETE", children: /* @__PURE__ */ jsx16(
        Button,
        {
          className: "bg-red-400 hover:bg-red-500 transition-colors text-primary w-24 px-4 py-2",
          type: "submit",
          isButton: !0,
          children: "\u0628\u0644\u0647"
        }
      ) })
    ] })
  ] }) }) });
}

// app/data/poem.server.ts
async function getAllPoems(userId) {
  let data = await prisma.poem.findMany({
    where: {
      userId
    }
  });
  if (!data)
    throw new Error("\u062F\u0631\u06CC\u0627\u0641\u062A \u0644\u06CC\u0633\u062A \u0627\u0634\u0639\u0627\u0631 \u0628\u0627 \u062E\u0637\u0627 \u0645\u0648\u0627\u062C\u0647 \u0634\u062F. \u062F\u0648\u0628\u0627\u0631\u0647 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F.");
  let listOfPoems = [];
  for (let poem of data) {
    let { id, poetId, alias, tags } = poem, poet = await prisma.poet.findUnique({
      where: {
        id: poetId
      }
    });
    if (!poet)
      throw new Error("\u0639\u0645\u0644\u06CC\u0627\u062A \u0628\u0627 \u062E\u0637\u0627 \u0645\u0648\u0627\u062C\u0647 \u0634\u062F. \u0645\u062C\u062F\u062F\u0627 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F.");
    let poemLines = await prisma.poemLine.findMany({
      where: {
        poemId: id
      }
    });
    listOfPoems.push({
      id,
      poet: poet.name,
      alias,
      tags,
      lines: poemLines
    });
  }
  return listOfPoems;
}
async function getPoemById(poemId) {
  let poem = await prisma.poem.findFirst({
    where: {
      id: poemId
    }
  });
  if (!poem)
    throw new Error("\u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u0639\u0631 \u0628\u0627 \u062E\u0637\u0627 \u0645\u0648\u0627\u062C\u0647 \u0634\u062F. \u062F\u0648\u0628\u0627\u0631\u0647 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F.");
  let { id, poetId, alias, tags } = poem, poet = await prisma.poet.findUnique({
    where: {
      id: poetId
    }
  });
  if (!poet)
    throw new Error("\u0639\u0645\u0644\u06CC\u0627\u062A \u0628\u0627 \u062E\u0637\u0627 \u0645\u0648\u0627\u062C\u0647 \u0634\u062F. \u0645\u062C\u062F\u062F\u0627 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F.");
  let poemLines = await prisma.poemLine.findMany({
    where: {
      poemId: id
    }
  });
  return {
    id,
    poet: poet.name,
    alias,
    tags,
    lines: poemLines
  };
}
async function addPoem(poem, userId) {
  let user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user)
    throw Error("\u0628\u0631\u0627\u06CC \u0627\u0641\u0632\u0648\u062F\u0646 \u0634\u0639\u0631 \u0628\u0627\u06CC\u062F \u0627\u0628\u062A\u062F\u0627 \u0648\u0627\u0631\u062F \u062D\u0633\u0627\u0628 \u06A9\u0627\u0631\u0628\u0631\u06CC \u062E\u0648\u062F \u0634\u0648\u06CC\u062F.");
  let newPoem = await prisma.poem.create({
    data: {
      user: {
        connect: {
          id: user.id
        }
      },
      alias: poem.alias,
      tags: poem.tags,
      poet: {
        connectOrCreate: {
          where: {
            name: poem.poet
          },
          create: {
            name: poem.poet
          }
        }
      },
      poemLines: {
        create: poem.lines
      }
    }
  });
  if (!newPoem)
    throw new CustomError("\u0639\u0645\u0644\u06CC\u0627\u062A \u0628\u0627 \u062E\u0637\u0627 \u0645\u0648\u0627\u062C\u0647 \u0634\u062F. \u062F\u0648\u0628\u0627\u0631\u0647 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F.", 401);
  return newPoem;
}
async function deletePoem(poemId) {
  if (!await prisma.poem.findUnique({
    where: { id: poemId }
  }))
    throw Error("\u0634\u0639\u0631 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F!");
  let result = await prisma.$transaction([
    prisma.poemLine.deleteMany({
      where: {
        poemId
      }
    }),
    prisma.poem.delete({
      where: {
        id: poemId
      }
    })
  ]);
  return console.log(result), result;
}
async function updatePoem(poemId, poem) {
  let existingPoem = await prisma.poem.findUnique({
    where: { id: poemId }
  });
  if (!existingPoem)
    throw Error("\u0634\u0639\u0631 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F!");
  let updatedPoem = await prisma.poem.update({
    where: {
      id: poemId
    },
    data: {
      user: {
        connect: {
          id: existingPoem.userId
        }
      },
      alias: poem.alias,
      tags: poem.tags,
      poet: {
        connectOrCreate: {
          where: {
            name: poem.poet
          },
          create: {
            name: poem.poet
          }
        }
      },
      poemLines: {
        // This will delete all existing poemLines and create new ones
        deleteMany: {},
        create: poem.lines
      }
    }
  });
  if (!updatedPoem)
    throw new CustomError("\u0639\u0645\u0644\u06CC\u0627\u062A \u0628\u0627 \u062E\u0637\u0627 \u0645\u0648\u0627\u062C\u0647 \u0634\u062F. \u062F\u0648\u0628\u0627\u0631\u0647 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F.", 401);
  return updatedPoem;
}

// app/routes/_app.poem.$id.delete.tsx
import { jsx as jsx17 } from "react/jsx-runtime";
var meta2 = () => [{ title: "\u0641\u06A9\u0631 \u0646\u0648\u06CC\u0633 - \u062D\u0630\u0641 \u0634\u0639\u0631" }], loader5 = async ({ params }) => params.id;
function DeletePoemPage() {
  let poemId = useLoaderData3(), data = useMatches().find((match) => match.id === "routes/_app.poem").data, { username } = data, { alias } = data.poems.find((poem) => poem.id === poemId);
  return /* @__PURE__ */ jsx17(DeletePoemModal, { alias, username, poemId });
}
var action4 = async ({ request, params }) => {
  if (request.method !== "DELETE")
    throw json3({ message: "\u0646\u0648\u0639 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A." }, { status: 400 });
  if (!params.id)
    throw json3({ message: "\u0634\u0639\u0631 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F. \u0645\u062C\u062F\u062F\u0627 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F." });
  try {
    await deletePoem(params.id);
  } catch (error) {
    return error;
  }
  return redirect5("/poem");
};

// app/routes/_app.dictionary.tsx
var app_dictionary_exports = {};
__export(app_dictionary_exports, {
  default: () => Dictionary,
  loader: () => loader6,
  meta: () => meta3
});

// app/components/pages/dictionary/Sidebar.tsx
import { Link as Link7, useLoaderData as useLoaderData4, useSearchParams } from "@remix-run/react";
import { Fragment as Fragment4, jsx as jsx18, jsxs as jsxs9 } from "react/jsx-runtime";
function Sidebar() {
  let { username } = useLoaderData4(), [searchParams, setSearchParams] = useSearchParams();
  return /* @__PURE__ */ jsxs9(Fragment4, { children: [
    /* @__PURE__ */ jsxs9("div", { className: "h-24", children: [
      /* @__PURE__ */ jsx18("h3", { className: "font-bold text-2xl text-center", children: "\u062F\u06CC\u06A9\u0634\u0646\u0631\u06CC \u0634\u062E\u0635\u06CC" }),
      /* @__PURE__ */ jsxs9("p", { className: "mt-5 text-sm text-center", children: [
        username,
        "\u060C \u062E\u0648\u0634 \u0622\u0645\u062F\u06CC\u062F!"
      ] })
    ] }),
    /* @__PURE__ */ jsxs9("div", { className: "flex flex-col rounded-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxs9("div", { className: "bg-green_dark text-primary px-5 py-4 flex justify-between", children: [
        /* @__PURE__ */ jsx18("h4", { className: "text-lg", children: "\u062D\u0631\u0648\u0641 \u0627\u0644\u0641\u0628\u0627" }),
        /* @__PURE__ */ jsx18(
          "button",
          {
            className: "text-xs border-b border-inherit",
            onClick: () => {
              searchParams.delete("term"), setSearchParams(searchParams);
            },
            children: "\u062D\u0630\u0641 \u0641\u06CC\u0644\u062A\u0631 \u0647\u0627"
          }
        )
      ] }),
      /* @__PURE__ */ jsx18("div", { className: "text-green_dark bg-green_light p-5", children: /* @__PURE__ */ jsx18("ul", { dir: "ltr", className: "grid grid-cols-4 gap-2", children: alphabets.map((char) => /* @__PURE__ */ jsx18(
        "li",
        {
          className: "text-center hover:bg-green_dark hover:text-primary cursor-pointer transition-colors rounded-sm",
          children: /* @__PURE__ */ jsx18(
            Link7,
            {
              preventScrollReset: !0,
              className: "block w-full h-full",
              to: `?term=${char}`,
              children: char
            }
          )
        },
        char
      )) }) })
    ] })
  ] });
}

// app/routes/_app.dictionary.tsx
import { Form as Form5, Outlet as Outlet2, useLoaderData as useLoaderData5, useSearchParams as useSearchParams2 } from "@remix-run/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

// app/components/pages/dictionary/WordBox.tsx
import { PencilIcon, XCircleIcon as XCircleIcon2 } from "@heroicons/react/24/solid";
import { jsx as jsx19, jsxs as jsxs10 } from "react/jsx-runtime";
function WordBox({
  word,
  meanings,
  appearance,
  definitions,
  examples,
  id
}) {
  return /* @__PURE__ */ jsxs10(
    "div",
    {
      id,
      dir: "ltr",
      className: "rounded-sm overflow-hidden drop-shadow-md",
      children: [
        /* @__PURE__ */ jsxs10("div", { className: "py-2 px-4 flex justify-between bg-green_dark text-primary", children: [
          /* @__PURE__ */ jsx19("h3", { className: "mr-auto", children: word }),
          /* @__PURE__ */ jsx19("h4", { className: "text-sm flex gap-x-2", children: meanings.map((mean, index) => /* @__PURE__ */ jsx19("span", { className: "px-1", children: mean }, index)) })
        ] }),
        /* @__PURE__ */ jsxs10("div", { className: "bg-green_light p-4", children: [
          /* @__PURE__ */ jsxs10("div", { children: [
            /* @__PURE__ */ jsx19("h5", { className: "font-bold text-sm mb-2", children: "Definition" }),
            /* @__PURE__ */ jsx19("ol", { className: "pl-6 list-decimal text-sm", children: definitions.map((def, index) => /* @__PURE__ */ jsx19("li", { children: def }, index)) })
          ] }),
          /* @__PURE__ */ jsxs10("div", { className: "text-sm", children: [
            /* @__PURE__ */ jsx19("h5", { className: "font-bold text-sm mt-2 mb-1", children: "Example" }),
            /* @__PURE__ */ jsx19("ol", { className: "pl-6 list-decimal text-sm", children: examples.map((example, index) => /* @__PURE__ */ jsx19("li", { className: "", children: example }, index)) })
          ] }),
          /* @__PURE__ */ jsxs10("div", { className: "text-xs", children: [
            /* @__PURE__ */ jsx19("h6", { className: "font-bold text-sm mt-2 mb-1", children: "Where have I seen it?" }),
            appearance.map((appearance2, index) => /* @__PURE__ */ jsx19("p", { className: "pl-3", children: appearance2 }, index))
          ] }),
          /* @__PURE__ */ jsxs10("div", { className: "flex justify-center gap-x-4 mt-4 mb-2", children: [
            /* @__PURE__ */ jsxs10(
              Button,
              {
                to: `/dictionary/${id}`,
                className: "flex justify-center items-center hover:gap-x-2 gap-x-1  hover:space-x-3 transition-all duration-200 ease-in-out rounded-sm w-24 text-xs text-primary bg-green_dark px-2 py-1",
                children: [
                  "Edit",
                  /* @__PURE__ */ jsx19(PencilIcon, { className: "w-5" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs10(
              Button,
              {
                to: `/dictionary/${id}/delete`,
                className: "flex justify-center items-center hover:gap-x-2 gap-x-1  hover:space-x-3 transition-all duration-150 ease-in-out rounded-sm w-24 text-xs bg-red-400  hover:bg-red-500 text-primary px-2 py-1",
                preventScrollReset: !0,
                children: [
                  "Delete",
                  /* @__PURE__ */ jsx19(XCircleIcon2, { className: "w-5" })
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}

// app/components/common/FAB.tsx
import { useState as useState2, useEffect } from "react";
import { PlusCircleIcon as PlusCircleIcon2 } from "@heroicons/react/24/solid";
import { Link as Link8 } from "@remix-run/react";
import { jsx as jsx20 } from "react/jsx-runtime";
function FAB({ pos, to }) {
  let [buttonBottom, setButtonBottom] = useState2(20);
  return useEffect(() => {
    let handleScroll = () => {
      let footerTop = document.getElementById("footer").getBoundingClientRect().top, newButtonBottom = Math.max(
        20,
        window.innerHeight - footerTop + 20
      );
      setButtonBottom(newButtonBottom);
    };
    return window.addEventListener("scroll", handleScroll), () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []), /* @__PURE__ */ jsx20(
    "div",
    {
      style: { bottom: `${buttonBottom}px` },
      title: "\u0627\u0641\u0632\u0648\u062F\u0646 \u0634\u0639\u0631 \u0628\u0647 \u06AF\u0646\u062C\u06CC\u0646\u0647",
      className: `fixed z-50 ${pos === "left" ? "left-10" : "right-10"} bg-green_dark w-12 h-12 rounded-full overflow-hidden`,
      children: /* @__PURE__ */ jsx20("button", { className: "block w-full", children: /* @__PURE__ */ jsx20(Link8, { to, children: /* @__PURE__ */ jsx20(PlusCircleIcon2, { className: "text-primary" }) }) })
    }
  );
}

// app/routes/_app.dictionary.tsx
import { useRef as useRef2, useState as useState3 } from "react";
import { Fragment as Fragment5, jsx as jsx21, jsxs as jsxs11 } from "react/jsx-runtime";
var meta3 = () => [
  { title: "My World, My Word" },
  {
    name: "description",
    content: "This is where I store the words that are new, interesting or valuable to me."
  }
], loader6 = async ({ request }) => {
  let userId = await requireUserSession(request), username = await getUsernameById(userId), words = await getAllWords(userId);
  return { username, words };
};
function Dictionary() {
  let { words } = useLoaderData5(), [searchTerm, setSearchTerm] = useState3(""), searchInputRef = useRef2(null), [searchParams] = useSearchParams2(), filter = searchParams.get("term") || "", filterWords = () => {
    if (!searchTerm.trim() && filter === "")
      return words;
    if (filter !== "")
      return words.filter((word) => word.word.startsWith(filter));
    let lowercasedSearchTerm = searchTerm.toLowerCase();
    return words.filter(
      (word) => word.word.toLowerCase().includes(lowercasedSearchTerm) || word.meanings.some(
        (meaning) => meaning.toLowerCase().includes(lowercasedSearchTerm)
      ) || word.definitions.some(
        (definition) => definition.toLowerCase().includes(lowercasedSearchTerm)
      ) || word.examples.some(
        (example) => example.toLowerCase().includes(lowercasedSearchTerm)
      ) || word.appearance.some(
        (appearance) => appearance.toLowerCase().includes(lowercasedSearchTerm)
      )
    );
  };
  return /* @__PURE__ */ jsxs11(Fragment5, { children: [
    /* @__PURE__ */ jsxs11("main", { className: "flex py-12 pr-14", children: [
      /* @__PURE__ */ jsxs11("div", { className: "w-3/4 pr-32 pl-16 flex flex-col", children: [
        /* @__PURE__ */ jsx21(
          "div",
          {
            dir: "ltr",
            className: "h-24 flex flex-col justify-center",
            children: /* @__PURE__ */ jsxs11(Form5, { className: "flex relative", children: [
              /* @__PURE__ */ jsx21(
                "input",
                {
                  type: "text",
                  className: "w-full py-3 rounded-sm outline-none border-none px-2 pl-11 bg-cWhite placeholder:text-sm",
                  placeholder: "search a word...",
                  value: searchTerm,
                  onChange: (e) => setSearchTerm(e.target.value),
                  ref: searchInputRef
                }
              ),
              /* @__PURE__ */ jsx21("button", { className: "h-1/2 absolute left-[0.6rem] top-1/2 transform -translate-y-1/2 z-10", children: /* @__PURE__ */ jsx21(MagnifyingGlassIcon, { className: "h-full" }) })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs11("div", { className: "flex flex-col gap-y-4", children: [
          words.length === 0 && /* @__PURE__ */ jsxs11("p", { className: "mt-5 text-center", children: [
            "\u0647\u0646\u0648\u0632 \u0648\u0627\u0698\u0647\u200C\u0627\u06CC \u0627\u0636\u0627\u0641\u0647 \u0646\u06A9\u0631\u062F\u0647 \u0627\u06CC\u062F. \u0627\u0632",
            " ",
            /* @__PURE__ */ jsx21(
              Button,
              {
                className: "px-4 py-1 w-10 bg-green_dark text-primary",
                to: "add",
                children: "\u0627\u06CC\u0646\u062C\u0627"
              }
            ),
            " ",
            "\u0627\u0642\u062F\u0627\u0645 \u06A9\u0646\u06CC\u062F!"
          ] }),
          words.length > 0 && filterWords().length === 0 && /* @__PURE__ */ jsxs11("p", { className: "mt-5 text-center flex flex-col items-center gap-y-5", children: [
            "\u0648\u0627\u0698\u0647\u200C\u0627\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F!",
            /* @__PURE__ */ jsx21(
              Button,
              {
                className: "px-4 block py-2 w-32 bg-green_dark text-primary",
                isButton: !0,
                onClick: () => {
                  setSearchTerm(""), searchInputRef.current?.focus();
                },
                children: "\u062D\u0630\u0641 \u0641\u06CC\u0644\u062A\u0631 \u0633\u0631\u0686"
              }
            )
          ] }),
          filterWords().map((word) => /* @__PURE__ */ jsx21(WordBox, { ...word }, word.id))
        ] })
      ] }),
      /* @__PURE__ */ jsx21("div", { className: "w-1/4 mx-10", children: /* @__PURE__ */ jsx21(Sidebar, {}) }),
      /* @__PURE__ */ jsx21(FAB, { pos: "right", to: "/dictionary/add" })
    ] }),
    /* @__PURE__ */ jsx21(Outlet2, {})
  ] });
}

// app/routes/_app.poem_.$id.tsx
var app_poem_id_exports = {};
__export(app_poem_id_exports, {
  action: () => action5,
  default: () => EditPoemPage,
  loader: () => loader7,
  meta: () => meta4
});

// app/components/pages/poem/PoemForm.tsx
import { useRef as useRef3, useState as useState4 } from "react";
import {
  Form as Form6,
  Link as Link9,
  useActionData as useActionData2,
  useNavigation as useNavigation2,
  useSubmit as useSubmit2
} from "@remix-run/react";
import { PlusIcon as PlusIcon2, XCircleIcon as XCircleIcon3 } from "@heroicons/react/24/solid";
import { jsx as jsx22, jsxs as jsxs12 } from "react/jsx-runtime";
function PoemForm({ poem }) {
  let defaultValues;
  poem ? defaultValues = {
    poet: poem.poet,
    alias: poem.alias,
    tags: poem.tags,
    lines: poem.lines
  } : defaultValues = {
    poet: "",
    alias: "",
    tags: [],
    lines: [{ p1: "", p2: "" }]
  };
  let [poet, setPoet] = useState4(defaultValues.poet), [poemName, setPoemName] = useState4(defaultValues.alias), [lines, setLines] = useState4(defaultValues.lines), [tags, setTags] = useState4(defaultValues.tags), [tagInput, setTagInput] = useState4(""), tagInputRef = useRef3(null), validationErrors = useActionData2(), submit = useSubmit2(), navigation = useNavigation2(), handlePoetChange = (poet2) => {
    setPoet(poet2);
  }, handlePoemNameChange = (poemName2) => {
    setPoemName(poemName2);
  }, addLine = () => {
    setLines([...lines, { p1: "", p2: "" }]);
  }, removeLine = (index) => {
    let newLines = [...lines];
    newLines.splice(index, 1), setLines(newLines);
  }, handleInputChange = (index, part, value) => {
    let newLines = [...lines];
    newLines[index][part] = value, setLines(newLines);
  }, handleTagInputChange = (value) => {
    setTagInput(value);
  }, addTag = () => {
    tagInput.trim() !== "" && (setTags((prevTags) => [...prevTags, tagInput.trim()]), setTagInput(""), tagInputRef.current?.focus());
  }, deleteTag = (index) => {
    let newTags = [...tags];
    newTags.splice(index, 1), setTags(newTags);
  }, handleTagInputKeyDown = (e) => {
    e.key === "Enter" && (e.preventDefault(), addTag());
  };
  return /* @__PURE__ */ jsx22("div", { className: "w-3/5 flex flex-col", children: /* @__PURE__ */ jsxs12(
    Form6,
    {
      method: "POST",
      className: "rounded-sm overflow-hidden drop-shadow-md",
      onSubmit: (e) => {
        e.preventDefault();
        let poemAsString = lines.map((line) => line.p1 + "," + line.p2).join("/"), tagsAsString = tags.join(","), formData = new FormData();
        formData.append("poet", poet), formData.append("alias", poemName), formData.append("tags", tagsAsString), formData.append("lines", poemAsString), submit(formData, {
          method: poem ? "PUT" : "POST",
          action: poem ? `/poem/${poem.id}` : "/poem/add"
        });
      },
      children: [
        /* @__PURE__ */ jsxs12("div", { className: "py-4 px-6 flex justify-between bg-green_dark text-primary", children: [
          /* @__PURE__ */ jsx22(
            "input",
            {
              className: `outline-none bg-transparent placeholder:text-primary placeholder:text-sm border-b border-primary pb-1 w-3/6 ${validationErrors?.alias && "border-red-600 border-b-2"}`,
              type: "text",
              placeholder: "\u0646\u0627\u0645 \u0634\u0639\u0631",
              value: poemName,
              onChange: (e) => handlePoemNameChange(e.target.value)
            }
          ),
          /* @__PURE__ */ jsx22(
            "input",
            {
              className: `outline-none bg-transparent placeholder:text-primary placeholder:text-sm border-b border-primary pb-1 w-2/6 ${validationErrors?.poet && "border-red-600 border-b-2"}`,
              type: "text",
              placeholder: "\u0646\u0627\u0645 \u0634\u0627\u0639\u0631",
              value: poet,
              onChange: (e) => handlePoetChange(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs12("div", { className: "p-6 bg-green_light flex flex-col", children: [
          /* @__PURE__ */ jsxs12("h3", { className: "flex gap-x-4 font-bold", children: [
            /* @__PURE__ */ jsxs12(
              "button",
              {
                type: "button",
                onClick: addLine,
                className: "font-normal flex gap-x-2 items-center bg-green_dark text-primary py-1 px-2 rounded-sm text-xs",
                children: [
                  /* @__PURE__ */ jsx22(PlusIcon2, { className: "font-bold w-4 h-4 rounded-full text-green_dark bg-primary" }),
                  /* @__PURE__ */ jsx22("span", { className: "border-b", children: "\u0627\u0641\u0632\u0648\u062F\u0646" })
                ]
              }
            ),
            "\u0645\u062A\u0646 \u0634\u0639\u0631:"
          ] }),
          /* @__PURE__ */ jsx22("div", { className: "flex justify-center items-center my-6", children: /* @__PURE__ */ jsx22("ul", { className: "text-sm w-full", children: lines.map((line, index) => /* @__PURE__ */ jsxs12(
            "div",
            {
              className: `flex gap-x-8 ${index !== 0 && "mt-4"}`,
              children: [
                /* @__PURE__ */ jsx22(
                  "input",
                  {
                    type: "text",
                    value: line.p1,
                    onChange: (e) => handleInputChange(
                      index,
                      "p1",
                      e.target.value
                    ),
                    placeholder: "\u0645\u0635\u0631\u0639 \u0627\u0648\u0644",
                    className: `outline-none bg-transparent placeholder:text-green_dark placeholder:text-sm border-b border-green_dark text-green_dark pb-1 flex-1 ${validationErrors?.lines?.lineNumber === index && validationErrors?.lines?.part === "p1" && "border-red-600 border-b-2 placeholder:text-red-600"}`
                  }
                ),
                /* @__PURE__ */ jsx22("div", { className: "w-4 mx-2", children: index !== 0 && /* @__PURE__ */ jsx22(
                  "button",
                  {
                    type: "button",
                    onClick: removeLine.bind(
                      null,
                      index
                    ),
                    children: /* @__PURE__ */ jsx22(XCircleIcon3, { className: "w-4" })
                  }
                ) }),
                /* @__PURE__ */ jsx22(
                  "input",
                  {
                    type: "text",
                    value: line.p2,
                    onChange: (e) => handleInputChange(
                      index,
                      "p2",
                      e.target.value
                    ),
                    placeholder: "\u0645\u0635\u0631\u0639 \u062F\u0648\u0645",
                    className: `outline-none bg-transparent placeholder:text-green_dark placeholder:text-sm border-b border-green_dark text-green_dark pb-1 flex-1 ${validationErrors?.lines?.lineNumber === index && validationErrors?.lines?.part === "p2" && "border-red-600 border-b-2 placeholder:text-red-600"}`
                  }
                )
              ]
            },
            index
          )) }) }),
          /* @__PURE__ */ jsxs12("div", { className: "pb-2 py-4", children: [
            /* @__PURE__ */ jsxs12("div", { className: "flex gap-x-2 items-center", children: [
              /* @__PURE__ */ jsxs12("h3", { className: "flex gap-x-4 font-bold", children: [
                /* @__PURE__ */ jsxs12(
                  "button",
                  {
                    type: "button",
                    onClick: addTag,
                    className: "font-normal flex gap-x-2 items-center bg-green_dark text-primary py-1 px-2 rounded-sm text-xs",
                    children: [
                      /* @__PURE__ */ jsx22(PlusIcon2, { className: "font-bold w-4 h-4 rounded-full text-green_dark bg-primary" }),
                      /* @__PURE__ */ jsx22("span", { className: "border-b", children: "\u0627\u0641\u0632\u0648\u062F\u0646" })
                    ]
                  }
                ),
                "\u0628\u0631\u0686\u0633\u0628\u200C\u0647\u0627:"
              ] }),
              /* @__PURE__ */ jsx22(
                "input",
                {
                  type: "text",
                  value: tagInput,
                  onChange: (e) => handleTagInputChange(e.target.value),
                  placeholder: "\u0646\u0627\u0645 \u0628\u0631\u0686\u0633\u0628",
                  onKeyDown: handleTagInputKeyDown,
                  ref: tagInputRef,
                  className: `outline-none bg-transparent placeholder:text-green_dark placeholder:text-xs border-b border-green_dark mr-4 ${validationErrors?.tags && "border-red-600 border-b-2"}`
                }
              )
            ] }),
            /* @__PURE__ */ jsx22("p", { className: "mt-4 flex gap-x-2  text-green_dark text-sm", children: tags.map((tag, index) => /* @__PURE__ */ jsxs12(
              "span",
              {
                className: "px-2 py-0.5 rounded-sm bg-green_dark text-primary",
                children: [
                  tag,
                  /* @__PURE__ */ jsx22(
                    "button",
                    {
                      type: "button",
                      onClick: () => deleteTag(index),
                      className: "mr-1",
                      children: /* @__PURE__ */ jsx22(XCircleIcon3, { className: "w-4" })
                    }
                  )
                ]
              },
              index
            )) })
          ] }),
          validationErrors && /* @__PURE__ */ jsx22("ul", { className: "my-2", children: Object.values(validationErrors).map((error, i) => /* @__PURE__ */ jsx22(
            "li",
            {
              className: "text-red-600 text-sm before:w-3 before:rounded-full",
              children: typeof error == "string" && error
            },
            i
          )) }),
          /* @__PURE__ */ jsxs12("div", { className: "mt-10 flex flex-col gap-y-3 items-center", children: [
            /* @__PURE__ */ jsx22(
              Button,
              {
                isButton: !0,
                type: "submit",
                className: "bg-green_dark text-primary w-44 py-2 rounded-sm",
                isLoading: navigation.state !== "idle",
                children: "\u062A\u0627\u06CC\u06CC\u062F"
              }
            ),
            /* @__PURE__ */ jsx22(
              Link9,
              {
                className: "text-xs pb-1 border-b border-green_dark",
                to: "/poem",
                children: "\u0628\u0627\u0632\u06AF\u0634\u062A \u0628\u0647 \u0634\u0639\u0631"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}

// app/routes/_app.poem_.$id.tsx
import {
  json as json4,
  redirect as redirect6
} from "@remix-run/node";
import { useLoaderData as useLoaderData6 } from "@remix-run/react";
import { jsx as jsx23, jsxs as jsxs13 } from "react/jsx-runtime";
var meta4 = () => [{ title: "\u0641\u06A9\u0631 \u0646\u0648\u06CC\u0633 - \u0648\u06CC\u0631\u0627\u06CC\u0634 \u0634\u0639\u0631" }], loader7 = async ({ request, params }) => {
  await requireUserSession(request);
  let poemId = params.id;
  return await getPoemById(poemId);
};
function EditPoemPage() {
  let poemData = useLoaderData6();
  return console.log(poemData.lines), /* @__PURE__ */ jsxs13("main", { className: "my-10 flex flex-col items-center gap-y-8", children: [
    /* @__PURE__ */ jsx23("h2", { className: "text-xl font-bold", children: "\u0648\u06CC\u0631\u0627\u06CC\u0634 \u0634\u0639\u0631" }),
    /* @__PURE__ */ jsx23(PoemForm, { poem: poemData })
  ] });
}
var action5 = async ({ request, params }) => {
  let poemId = params.id;
  if (request.method !== "PUT")
    throw json4({ message: "\u0646\u0648\u0639 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A." }, { status: 400 });
  if (!params.id)
    throw json4({ message: "\u0634\u0639\u0631 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F. \u0645\u062C\u062F\u062F\u0627 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F." });
  let formData = await request.formData(), poet = formData.get("poet"), alias = formData.get("alias"), tags = formData.get("tags"), lines = formData.get("lines");
  try {
    let verifiedData = validatePoemData({ poet, alias, tags, lines });
    return await updatePoem(poemId, verifiedData), redirect6("/poem");
  } catch (error) {
    return error;
  }
};

// app/routes/_app.poem_.add.tsx
var app_poem_add_exports = {};
__export(app_poem_add_exports, {
  action: () => action6,
  default: () => AddPoemPage,
  loader: () => loader8,
  meta: () => meta5
});
import {
  redirect as redirect7
} from "@remix-run/node";
import { jsx as jsx24, jsxs as jsxs14 } from "react/jsx-runtime";
var meta5 = () => [{ title: "\u0641\u06A9\u0631\u0646\u0648\u06CC\u0633 - \u0627\u0641\u0632\u0648\u062F\u0646 \u0634\u0639\u0631" }], loader8 = async ({ request }) => await requireUserSession(request);
function AddPoemPage() {
  return /* @__PURE__ */ jsxs14("main", { className: "my-10 flex flex-col items-center gap-y-8", children: [
    /* @__PURE__ */ jsx24("h2", { className: "text-xl font-bold", children: "\u0627\u0641\u0632\u0648\u062F\u0646 \u0634\u0639\u0631" }),
    /* @__PURE__ */ jsx24(PoemForm, {})
  ] });
}
var action6 = async ({ request }) => {
  await requireUserSession(request);
  let formData = await request.formData(), poet = formData.get("poet"), alias = formData.get("alias"), tags = formData.get("tags"), lines = formData.get("lines");
  try {
    let verifiedData = validatePoemData({ poet, alias, tags, lines }), userId = await getUserFromSession(request), addedPoem;
    return userId && (addedPoem = await addPoem(verifiedData, userId)), console.log(addedPoem), redirect7("/poem");
  } catch (error) {
    return error;
  }
};

// app/routes/_app._index.tsx
var app_index_exports = {};
__export(app_index_exports, {
  default: () => Index,
  loader: () => loader9,
  meta: () => meta6
});
import { jsx as jsx25, jsxs as jsxs15 } from "react/jsx-runtime";
var meta6 = () => [
  { title: "Write For Life" },
  {
    name: "description",
    content: "a place for writing, remembering, noting, and everything that comes with it!"
  }
], loader9 = async ({ request }) => {
  let userId = await getUserFromSession(request);
  return userId ? await getUsernameById(userId) : "friend";
};
function Index() {
  return /* @__PURE__ */ jsxs15("main", { className: "mx-28 my-10", children: [
    /* @__PURE__ */ jsxs15("section", { className: "flex rounded-sm overflow-hidden h-64", children: [
      /* @__PURE__ */ jsx25("div", { className: "w-2/5 bg-landingMain bg-no-repeat bg-center bg-cover" }),
      /* @__PURE__ */ jsxs15("div", { className: "w-3/5 bg-cWhite p-8 text-center", children: [
        /* @__PURE__ */ jsx25("h3", { className: "text-2xl font-bold", children: "\u0686\u0631\u0627 \u0641\u06A9\u0631 \u0646\u0648\u06CC\u0633\u061F" }),
        /* @__PURE__ */ jsx25("p", { className: " mt-8 mb-5", children: "\u0641\u06A9\u0631 \u0646\u0648\u06CC\u0633 \u06CC\u06A9 \u067E\u0644\u062A\u0641\u0631\u0645 \u0622\u0646\u0644\u0627\u06CC\u0646\u060C \u0627\u0645\u0646 \u0648 \u0633\u0631\u06CC\u0639 \u0628\u0631\u0627\u06CC \u062B\u0628\u062A \u0639\u0644\u0627\u06CC\u0642 \u0634\u062E\u0635\u06CC \u0634\u0645\u0627\u0633\u062A." }),
        /* @__PURE__ */ jsx25("p", { className: "mb-8", children: "\u0628\u0631\u0627\u06CC \u062F\u06CC\u062F\u0646 \u0628\u062E\u0634 \u0647\u0627\u06CC \u0645\u062E\u062A\u0644\u0641 \u0622\u0646 \u0631\u0648\u06CC \u062F\u06A9\u0645\u0647 \u0632\u06CC\u0631 \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F." }),
        /* @__PURE__ */ jsx25(
          Button,
          {
            to: "#content",
            className: "py-2 px-5 bg-green_dark text-primary font-bold",
            children: "\u0645\u0646 \u0631\u0627 \u0628\u0647 \u0622\u0646\u062C\u0627 \u0628\u0628\u0631"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs15(
      "section",
      {
        id: "content",
        className: "flex rounded-sm overflow-hidden h-80 my-10",
        children: [
          /* @__PURE__ */ jsx25("div", { className: "w-1/4 bg-landingPoem bg-cover bg-center bg-no-repeat" }),
          /* @__PURE__ */ jsx25("div", { className: "flex-1 flex flex-col justify-center", children: /* @__PURE__ */ jsxs15("div", { className: "bg-cWhite h-2/3 text-center py-5", children: [
            /* @__PURE__ */ jsx25("h3", { className: "text-xl font-bold", children: "\u06AF\u0646\u062C\u06CC\u0646\u0647 \u0627\u0634\u0639\u0627\u0631" }),
            /* @__PURE__ */ jsx25("p", { className: "mt-10 mb-8", children: "\u0641\u0636\u0627\u06CC\u06CC \u0634\u062E\u0635\u06CC \u0628\u0631\u0627\u06CC \u062B\u0628\u062A \u0627\u0634\u0639\u0627\u0631 \u0645\u0648\u0631\u062F \u0639\u0644\u0627\u0642\u0647\u200C\u06CC \u0634\u0645\u0627!" }),
            /* @__PURE__ */ jsx25(
              Button,
              {
                className: "bg-green_dark py-3 px-5 rounded-sm text-primary",
                to: "/poem",
                children: "\u0631\u0641\u062A\u0646 \u0628\u0647 \u0635\u0641\u062D\u0647"
              }
            )
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs15("section", { className: "flex rounded-sm overflow-hidden h-80", children: [
      /* @__PURE__ */ jsx25("div", { className: "flex-1 flex flex-col justify-center", children: /* @__PURE__ */ jsxs15("div", { className: "bg-cWhite h-2/3 text-center py-5", children: [
        /* @__PURE__ */ jsx25("h3", { className: "text-xl font-bold", children: "\u062F\u06CC\u06A9\u0634\u0646\u0631\u06CC \u0634\u062E\u0635\u06CC" }),
        /* @__PURE__ */ jsx25("p", { className: "mt-10 mb-8", children: "\u0641\u0636\u0627\u06CC\u06CC \u0634\u062E\u0635\u06CC \u0628\u0631\u0627\u06CC \u062B\u0628\u062A \u06A9\u0644\u0645\u0627\u062A \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0645\u0648\u0631\u062F \u0639\u0644\u0627\u0642\u0647\u200C\u06CC \u0634\u0645\u0627!" }),
        /* @__PURE__ */ jsx25(
          Button,
          {
            className: "bg-green_dark py-3 px-5 rounded-sm text-primary",
            to: "/poem",
            children: "\u0631\u0641\u062A\u0646 \u0628\u0647 \u0635\u0641\u062D\u0647"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx25("div", { className: "w-1/4 bg-landingDictionary bg-cover bg-center bg-no-repeat" })
    ] })
  ] });
}

// app/routes/_app.poem.tsx
var app_poem_exports = {};
__export(app_poem_exports, {
  default: () => PoemPage,
  loader: () => loader10,
  meta: () => meta7
});
import { Form as Form7, Outlet as Outlet3, useLoaderData as useLoaderData8, useSearchParams as useSearchParams5 } from "@remix-run/react";
import { MagnifyingGlassIcon as MagnifyingGlassIcon2 } from "@heroicons/react/24/solid";

// app/components/pages/poem/PoemBox.tsx
import { Link as Link10 } from "@remix-run/react";
import { PencilIcon as PencilIcon2, XCircleIcon as XCircleIcon4 } from "@heroicons/react/24/solid";
import { jsx as jsx26, jsxs as jsxs16 } from "react/jsx-runtime";
function PoemBox({
  alias,
  poet,
  lines,
  tags,
  id
}) {
  return /* @__PURE__ */ jsxs16("div", { className: "rounded-sm overflow-hidden drop-shadow-md", id, children: [
    /* @__PURE__ */ jsxs16("div", { className: "py-2 px-4 flex justify-between bg-green_dark text-primary", children: [
      /* @__PURE__ */ jsx26("h3", { className: "", children: alias }),
      /* @__PURE__ */ jsx26("h4", { className: "text-sm", children: poet })
    ] }),
    /* @__PURE__ */ jsxs16("div", { className: "bg-green_light flex flex-col relative", children: [
      /* @__PURE__ */ jsx26("div", { className: "flex justify-center items-center my-5", children: /* @__PURE__ */ jsx26("ul", { className: "text-sm", children: lines.map((poem, index) => /* @__PURE__ */ jsxs16(
        "li",
        {
          className: `grid grid-cols-2 gap-x-8 ${index !== 0 && "mt-3"}`,
          children: [
            /* @__PURE__ */ jsx26("p", { children: poem.p1 }),
            /* @__PURE__ */ jsx26("p", { children: poem.p2 })
          ]
        },
        index
      )) }) }),
      /* @__PURE__ */ jsx26("p", { className: "pr-4 pb-2", children: tags.map((tag, i, arr) => /* @__PURE__ */ jsxs16("span", { children: [
        /* @__PURE__ */ jsx26(
          Link10,
          {
            to: `?tag=${tag}`,
            className: "text-xs",
            children: tag
          },
          tag
        ),
        i !== arr.length - 1 && " - "
      ] }, i)) }),
      /* @__PURE__ */ jsxs16("div", { className: "flex justify-center gap-x-4 mb-2", children: [
        /* @__PURE__ */ jsxs16(
          Button,
          {
            to: `/poem/${id}`,
            className: "flex justify-center items-center hover:gap-x-2 gap-x-1  hover:space-x-3 transition-all duration-200 ease-in-out rounded-sm w-24 text-xs text-primary bg-green_dark px-2 py-1",
            children: [
              "\u0648\u06CC\u0631\u0627\u06CC\u0634",
              /* @__PURE__ */ jsx26(PencilIcon2, { className: "w-5" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs16(
          Button,
          {
            to: `/poem/${id}/delete`,
            className: "flex justify-center items-center hover:gap-x-2 gap-x-1  hover:space-x-3 transition-all duration-150 ease-in-out rounded-sm w-24 text-xs bg-red-400  hover:bg-red-500 text-primary px-2 py-1",
            preventScrollReset: !0,
            children: [
              "\u062D\u0630\u0641",
              /* @__PURE__ */ jsx26(XCircleIcon4, { className: "w-5" })
            ]
          }
        )
      ] })
    ] })
  ] });
}

// app/components/pages/poem/FilterBox.tsx
import { useSearchParams as useSearchParams3 } from "@remix-run/react";
import { useEffect as useEffect2, useState as useState5 } from "react";
import { jsx as jsx27, jsxs as jsxs17 } from "react/jsx-runtime";
function FilterBox({ heading, data, border }) {
  let [showAllOptions, setShowAllOptions] = useState5(!1), [filterParams, setFilterParams] = useState5([]), [searchParams, setSearchParams] = useSearchParams3(), params = searchParams.get("filters") || "";
  useEffect2(() => {
    params !== "" && setFilterParams(params.split(",").filter((s) => s !== ""));
  }, [params]), console.log("f", filterParams);
  let handleCheckboxChange = (e, item) => {
    let isChecked = e.target.checked, selectedItemsArray = (searchParams.get("filters") || "").split(",").filter((s) => s !== "");
    if (console.log(selectedItemsArray), isChecked) {
      let updatedItems = [...selectedItemsArray, item];
      console.log(updatedItems), setSearchParams({ filters: updatedItems.join(",") });
    } else {
      let updatedItems = selectedItemsArray.filter(
        (selectedItem) => selectedItem !== item
      );
      console.log(updatedItems), setSearchParams({ filters: updatedItems.join(",") });
    }
  };
  showAllOptions || (data = data.slice(0, 3));
  let btnText = showAllOptions ? "- \u0628\u0633\u062A\u0646" : "+ \u0628\u06CC\u0634\u062A\u0631";
  return /* @__PURE__ */ jsxs17("div", { className: `${border && "border-b border-main"} py-5`, children: [
    /* @__PURE__ */ jsx27("h5", { className: "mb-5 font-bold text-sm", children: heading }),
    /* @__PURE__ */ jsxs17("ul", { className: "flex flex-col gap-y-2 text-sm", children: [
      data.length === 0 ? /* @__PURE__ */ jsx27("p", { className: "text-xs flex flex-col", children: "\u0627\u0628\u062A\u062F\u0627 \u0634\u0639\u0631\u06CC \u062B\u0628\u062A \u06A9\u0646\u06CC\u062F." }) : data.map((item, i) => /* @__PURE__ */ jsxs17("li", { className: "flex gap-x-2", children: [
        /* @__PURE__ */ jsx27(
          "input",
          {
            type: "checkbox",
            name: item,
            id: item,
            checked: filterParams.includes(item),
            onChange: (e) => handleCheckboxChange(e, item)
          }
        ),
        /* @__PURE__ */ jsx27("label", { htmlFor: item, children: item })
      ] }, i)),
      /* @__PURE__ */ jsx27(
        "button",
        {
          onClick: () => setShowAllOptions((prevState) => !prevState),
          className: "text-right text-xs mt-4",
          children: btnText
        }
      )
    ] })
  ] });
}

// app/components/pages/poem/Sidebar.tsx
import { useLoaderData as useLoaderData7, useSearchParams as useSearchParams4 } from "@remix-run/react";
import { Fragment as Fragment6, jsx as jsx28, jsxs as jsxs18 } from "react/jsx-runtime";
function Sidebar2() {
  let { username, tagsFilter, poetsFilter } = useLoaderData7(), [searchParams, setSearchParams] = useSearchParams4();
  return /* @__PURE__ */ jsxs18(Fragment6, { children: [
    /* @__PURE__ */ jsxs18("div", { className: "h-24", children: [
      /* @__PURE__ */ jsx28("h3", { className: "font-bold text-2xl text-center", children: "\u0628\u062E\u0648\u0627\u0646 \u0645\u0631\u0627" }),
      /* @__PURE__ */ jsxs18("p", { className: "mt-5 text-sm text-center", children: [
        username,
        "\u060C \u062E\u0648\u0634 \u0622\u0645\u062F\u06CC\u062F!"
      ] })
    ] }),
    /* @__PURE__ */ jsxs18("div", { className: "flex flex-col rounded-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxs18("div", { className: "bg-green_dark text-primary px-5 py-4 flex justify-between", children: [
        /* @__PURE__ */ jsx28("h4", { className: "text-lg", children: "\u0641\u06CC\u0644\u062A\u0631 \u0647\u0627" }),
        /* @__PURE__ */ jsx28(
          "button",
          {
            onClick: () => {
              searchParams.delete("filters"), setSearchParams(searchParams);
            },
            className: "text-xs border-b border-inherit",
            children: "\u062D\u0630\u0641 \u0641\u06CC\u0644\u062A\u0631 \u0647\u0627"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs18("div", { className: "text-green_dark bg-green_light px-5", children: [
        /* @__PURE__ */ jsx28(
          FilterBox,
          {
            heading: "\u0628\u0631 \u0627\u0633\u0627\u0633 \u0634\u0627\u0639\u0631",
            data: poetsFilter,
            border: !0
          }
        ),
        /* @__PURE__ */ jsx28(FilterBox, { heading: "\u0628\u0631 \u0627\u0633\u0627\u0633 \u0645\u0648\u0636\u0648\u0639", data: tagsFilter })
      ] })
    ] })
  ] });
}

// app/routes/_app.poem.tsx
import { useRef as useRef4, useState as useState6 } from "react";
import { Fragment as Fragment7, jsx as jsx29, jsxs as jsxs19 } from "react/jsx-runtime";
var meta7 = () => [
  { title: "\u0641\u06A9\u0631\u0646\u0648\u06CC\u0633 - \u0627\u0634\u0639\u0627\u0631" },
  {
    name: "description",
    content: "This is where I store the words that are new, interesting or valuable to me."
  }
], loader10 = async ({ request, params }) => {
  let userId = await requireUserSession(request), username = await getUsernameById(userId), poems = await getAllPoems(userId), tagsFilter = poems.map((poem) => poem.tags).flat();
  tagsFilter = tagsFilter.filter(
    (item, index) => tagsFilter.indexOf(item) === index
  );
  let poetsFilter = poems.map((poem) => poem.poet);
  return poetsFilter = poetsFilter.filter(
    (item, index) => poetsFilter.indexOf(item) === index
  ), { username, poems, tagsFilter, poetsFilter };
};
function PoemPage() {
  let { poems } = useLoaderData8(), [searchTerm, setSearchTerm] = useState6(""), [searchParams] = useSearchParams5(), filters = (searchParams.get("filters") || "").split(",").filter((filter) => filter.trim() !== ""), searchInputRef = useRef4(null), filterPoems = () => {
    if (!searchTerm.trim() && filters.length === 0)
      return poems;
    let lowercasedSearchTerm = searchTerm.toLowerCase();
    return poems.filter(
      (poem) => (filters.length === 0 || // Check if filters array is empty
      filters.some(
        (item) => (
          // Add your specific conditions for selected items
          poem.poet.toLowerCase().includes(item) || poem.alias.toLowerCase().includes(item) || poem.tags.some(
            (tag) => tag.toLowerCase().includes(item)
          ) || poem.lines.some(
            (line) => [line.p1, line.p2].some(
              (text) => text.toLowerCase().includes(item)
            )
          )
        )
      )) && // Add your existing search term conditions
      (poem.poet.toLowerCase().includes(lowercasedSearchTerm) || poem.alias.toLowerCase().includes(lowercasedSearchTerm) || poem.tags.some(
        (tag) => tag.toLowerCase().includes(lowercasedSearchTerm)
      ) || poem.lines.some(
        (line) => [line.p1, line.p2].some(
          (text) => text.toLowerCase().includes(lowercasedSearchTerm)
        )
      ))
    );
  };
  return /* @__PURE__ */ jsxs19(Fragment7, { children: [
    /* @__PURE__ */ jsxs19("main", { className: "flex py-12 px-14", children: [
      /* @__PURE__ */ jsx29("div", { className: "w-1/4 mx-10", children: /* @__PURE__ */ jsx29(Sidebar2, {}) }),
      /* @__PURE__ */ jsxs19("div", { className: "w-3/4 pr-16 pl-32 flex flex-col", children: [
        /* @__PURE__ */ jsx29("div", { className: "h-24 flex flex-col justify-center", children: /* @__PURE__ */ jsxs19(Form7, { className: "flex relative", children: [
          /* @__PURE__ */ jsx29(
            "input",
            {
              type: "text",
              className: "w-full py-3 rounded-sm outline-none border-none px-2 pr-11 bg-cWhite placeholder:text-sm",
              placeholder: "\u062C\u0633\u062A\u062C\u0648\u06CC \u06CC\u06A9 \u06CC\u0627 \u0686\u0646\u062F \u06A9\u0644\u0645\u0647 \u062F\u0631 \u0634\u0639\u0631 \u0645\u0648\u0631\u062F \u0646\u0638\u0631",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              ref: searchInputRef
            }
          ),
          /* @__PURE__ */ jsx29("button", { className: "h-1/2 absolute right-[0.6rem] top-1/2 transform -translate-y-1/2 z-10", children: /* @__PURE__ */ jsx29(MagnifyingGlassIcon2, { className: "h-full" }) })
        ] }) }),
        /* @__PURE__ */ jsxs19("div", { className: "flex flex-col gap-y-4", children: [
          poems.length === 0 && /* @__PURE__ */ jsxs19("p", { className: "mt-5 text-center", children: [
            "\u0647\u0646\u0648\u0632 \u0634\u0639\u0631\u06CC \u0627\u0636\u0627\u0641\u0647 \u0646\u06A9\u0631\u062F\u0647 \u0627\u06CC\u062F. \u0627\u0632",
            " ",
            /* @__PURE__ */ jsx29(
              Button,
              {
                className: "px-4 py-1 w-10 bg-green_dark text-primary",
                to: "add",
                children: "\u0627\u06CC\u0646\u062C\u0627"
              }
            ),
            " ",
            "\u0627\u0642\u062F\u0627\u0645 \u06A9\u0646\u06CC\u062F!"
          ] }),
          poems.length > 0 && filterPoems().length === 0 && /* @__PURE__ */ jsxs19("p", { className: "mt-5 text-center flex flex-col items-center gap-y-5", children: [
            "\u0634\u0639\u0631\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F!",
            /* @__PURE__ */ jsx29(
              Button,
              {
                className: "px-4 block py-2 w-32 bg-green_dark text-primary",
                isButton: !0,
                onClick: () => {
                  setSearchTerm(""), searchInputRef.current?.focus();
                },
                children: "\u062D\u0630\u0641 \u0641\u06CC\u0644\u062A\u0631 \u0633\u0631\u0686"
              }
            )
          ] }),
          filterPoems().map((poem) => /* @__PURE__ */ jsx29(PoemBox, { ...poem }, poem.id))
        ] }),
        /* @__PURE__ */ jsx29("div", { className: "mt-10 bg-red-50" })
      ] }),
      /* @__PURE__ */ jsx29(FAB, { pos: "left", to: "/poem/add" })
    ] }),
    /* @__PURE__ */ jsx29(Outlet3, {})
  ] });
}

// app/routes/logout.ts
var logout_exports = {};
__export(logout_exports, {
  action: () => action7,
  loader: () => loader11
});
import { json as json5, redirect as redirect8 } from "@remix-run/node";
var action7 = async ({ request }) => {
  if (request.method !== "DELETE")
    throw json5({ message: "invalid request method." }, { status: 400 });
  return destroyUserSession(request);
}, loader11 = () => redirect8("/");

// app/routes/auth.tsx
var auth_exports = {};
__export(auth_exports, {
  action: () => action8,
  default: () => LoginPage,
  loader: () => loader12
});
import { redirect as redirect9 } from "@remix-run/node";
import { useSearchParams as useSearchParams6 } from "@remix-run/react";

// app/components/pages/auth/Auth.tsx
import { Form as Form8, Link as Link11, useActionData as useActionData3, useNavigation as useNavigation3 } from "@remix-run/react";

// app/components/pages/auth/FormControl.tsx
import { jsx as jsx30, jsxs as jsxs20 } from "react/jsx-runtime";
function FormControl({
  label,
  id,
  type,
  autoComplete,
  name
}) {
  return /* @__PURE__ */ jsxs20("div", { className: "relative", children: [
    /* @__PURE__ */ jsx30(
      "label",
      {
        className: "absolute right-2 top-1/2 transform -translate-y-1/2 text-xs opacity-70",
        htmlFor: id,
        children: label
      }
    ),
    /* @__PURE__ */ jsx30(
      "input",
      {
        dir: "ltr",
        className: "w-full rounded-sm outline-none border-none px-4 py-2",
        id,
        required: !0,
        name,
        type,
        autoComplete
      }
    )
  ] });
}

// app/components/pages/auth/Auth.tsx
import { jsx as jsx31, jsxs as jsxs21 } from "react/jsx-runtime";
var Auth = ({ mode: mode2 }) => {
  let validationErrors = useActionData3(), isLoading = useNavigation3().state !== "idle", btnText = mode2 === "login" ? "\u0648\u0631\u0648\u062F" : "\u0627\u06CC\u062C\u0627\u062F \u062D\u0633\u0627\u0628 \u06A9\u0627\u0631\u0628\u0631\u06CC", linkHref = mode2 === "login" ? "signup" : "login", linkText = {
    login: ["\u062D\u0633\u0627\u0628 \u06A9\u0627\u0631\u0628\u0631\u06CC \u0646\u062F\u0627\u0631\u06CC\u062F\u061F", "\u0633\u0627\u062E\u062A \u062D\u0633\u0627\u0628 \u062C\u062F\u06CC\u062F"],
    signup: ["\u0642\u0628\u0644\u0627 \u062B\u0628\u062A\u200C\u0646\u0627\u0645 \u06A9\u0631\u062F\u0647\u200C\u0627\u06CC\u062F\u061F", "\u0648\u0631\u0648\u062F \u0628\u0647 \u062D\u0633\u0627\u0628"]
  };
  return /* @__PURE__ */ jsxs21("main", { className: "flex text-tGreenP", children: [
    /* @__PURE__ */ jsx31(
      "div",
      {
        className: `${mode2 === "login" ? "bg-login" : "bg-register"} bg-cover bg-center w-1/3 h-screen`,
        children: /* @__PURE__ */ jsx31("div", { className: "p-10 text-xl font-bold tracking-widest", children: /* @__PURE__ */ jsx31(Link11, { className: "text-primary", to: "/", children: "LOGO" }) })
      }
    ),
    /* @__PURE__ */ jsxs21("div", { className: "w-2/3 flex justify-center items-center flex-col", children: [
      /* @__PURE__ */ jsx31("h2", { className: "text-2xl mb-10", children: mode2 === "login" ? "\u0648\u0631\u0648\u062F \u0628\u0647 \u062D\u0633\u0627\u0628 \u06A9\u0627\u0631\u0628\u0631\u06CC" : "\u062B\u0628\u062A\u200C\u0646\u0627\u0645" }),
      /* @__PURE__ */ jsxs21(Form8, { method: "post", className: "w-1/2 flex flex-col gap-y-4", children: [
        mode2 === "signup" && /* @__PURE__ */ jsx31(
          FormControl,
          {
            label: "\u0646\u0627\u0645 \u06A9\u0627\u0631\u0628\u0631\u06CC",
            id: "username",
            type: "text",
            name: "username",
            autoComplete: "text"
          }
        ),
        /* @__PURE__ */ jsx31(
          FormControl,
          {
            label: "\u0622\u062F\u0631\u0633 \u0627\u06CC\u0645\u06CC\u0644",
            id: "email",
            type: "email",
            name: "email",
            autoComplete: "email"
          }
        ),
        /* @__PURE__ */ jsx31(
          FormControl,
          {
            label: "\u0631\u0645\u0632 \u0639\u0628\u0648\u0631",
            id: "password",
            type: "password",
            name: "password",
            autoComplete: "current-password"
          }
        ),
        mode2 === "signup" && /* @__PURE__ */ jsx31(
          FormControl,
          {
            label: "\u062A\u06A9\u0631\u0627\u0631 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631",
            id: "repeated-password",
            type: "password",
            name: "repeated-password",
            autoComplete: "current-password"
          }
        ),
        /* @__PURE__ */ jsx31(
          Button,
          {
            isButton: !0,
            isLoading,
            type: "submit",
            className: "bg-tGreenS hover:bg-hover disabled:hover:bg-tGreenS  text-cWhite w-full py-3 inline-block ",
            children: btnText
          }
        ),
        validationErrors && /* @__PURE__ */ jsx31("ul", { className: "mb-4", children: Object.values(validationErrors).map((error) => /* @__PURE__ */ jsx31(
          "li",
          {
            className: "text-red-600 text-sm",
            children: error
          },
          error
        )) }),
        /* @__PURE__ */ jsxs21("p", { className: "text-xs text-center", children: [
          mode2 === "login" ? linkText.login[0] : linkText.signup[0],
          /* @__PURE__ */ jsx31(
            Link11,
            {
              className: "mx-2 underline",
              to: `?mode=${linkHref}`,
              children: mode2 === "login" ? linkText.login[1] : linkText.signup[1]
            }
          )
        ] })
      ] })
    ] })
  ] });
}, Auth_default = Auth;

// app/routes/auth.tsx
import { Fragment as Fragment8, jsx as jsx32 } from "react/jsx-runtime";
var loader12 = async ({ request }) => await getUserFromSession(request) && redirect9("/");
function LoginPage() {
  let [searchParams] = useSearchParams6(), authMode = searchParams.get("mode") || "login";
  return /* @__PURE__ */ jsx32(Fragment8, { children: /* @__PURE__ */ jsx32(Auth_default, { mode: authMode }) });
}
var action8 = async ({ request }) => {
  let authMode = new URL(request.url).searchParams.get("mode") || "login", formData = await request.formData(), email = formData.get("email"), password = formData.get("password"), credentials;
  if (authMode === "login")
    credentials = {
      email,
      password
    };
  else {
    let repeatedPassword = formData.get("repeated-password"), username = formData.get("username");
    credentials = { email, password, repeatedPassword, username };
  }
  try {
    let signupCredentials = validateCredentials(credentials);
    return authMode === "login" ? await login(credentials) : await signup(signupCredentials);
  } catch (error) {
    if (isCustomError(error))
      throw { credentials: error.message };
    return error;
  }
};

// app/routes/_app.tsx
var app_exports = {};
__export(app_exports, {
  default: () => NotingLayout
});
import { Outlet as Outlet4 } from "@remix-run/react";
import { Fragment as Fragment9, jsx as jsx33, jsxs as jsxs22 } from "react/jsx-runtime";
function NotingLayout() {
  return /* @__PURE__ */ jsxs22(Fragment9, { children: [
    /* @__PURE__ */ jsx33("header", { className: "bg-green_dark h-1/6", children: /* @__PURE__ */ jsx33(MainNavigation, {}) }),
    /* @__PURE__ */ jsx33(Outlet4, {})
  ] });
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-OPRCOWJR.js", imports: ["/build/_shared/chunk-SL74XZ26.js", "/build/_shared/chunk-Q3IECNXJ.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-GCMTPQS7.js", imports: ["/build/_shared/chunk-2DDFIOFH.js", "/build/_shared/chunk-AAA34Y3T.js"], hasAction: !1, hasLoader: !0, hasErrorBoundary: !0 }, "routes/_app": { id: "routes/_app", parentId: "root", path: void 0, index: void 0, caseSensitive: void 0, module: "/build/routes/_app-K5QNUQGD.js", imports: void 0, hasAction: !1, hasLoader: !1, hasErrorBoundary: !1 }, "routes/_app._index": { id: "routes/_app._index", parentId: "routes/_app", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_app._index-6KS5RZPX.js", imports: ["/build/_shared/chunk-UWKDBUKV.js", "/build/_shared/chunk-AAA34Y3T.js"], hasAction: !1, hasLoader: !0, hasErrorBoundary: !1 }, "routes/_app.dictionary": { id: "routes/_app.dictionary", parentId: "routes/_app", path: "dictionary", index: void 0, caseSensitive: void 0, module: "/build/routes/_app.dictionary-SBINNIWW.js", imports: ["/build/_shared/chunk-YV45W4AE.js", "/build/_shared/chunk-4TY2JQZM.js", "/build/_shared/chunk-UYYHSP2O.js", "/build/_shared/chunk-BLJ6H3VR.js", "/build/_shared/chunk-UWKDBUKV.js", "/build/_shared/chunk-AAA34Y3T.js"], hasAction: !1, hasLoader: !0, hasErrorBoundary: !1 }, "routes/_app.dictionary.$id.delete": { id: "routes/_app.dictionary.$id.delete", parentId: "routes/_app.dictionary", path: ":id/delete", index: void 0, caseSensitive: void 0, module: "/build/routes/_app.dictionary.$id.delete-4N6NSVCK.js", imports: ["/build/_shared/chunk-U5GDIAWN.js", "/build/_shared/chunk-PGOH7JLP.js"], hasAction: !0, hasLoader: !0, hasErrorBoundary: !1 }, "routes/_app.dictionary_.$id": { id: "routes/_app.dictionary_.$id", parentId: "routes/_app", path: "dictionary/:id", index: void 0, caseSensitive: void 0, module: "/build/routes/_app.dictionary_.$id-O4RXV3A7.js", imports: ["/build/_shared/chunk-S2J4GCXK.js", "/build/_shared/chunk-UYYHSP2O.js", "/build/_shared/chunk-DQZWVC76.js", "/build/_shared/chunk-PGOH7JLP.js", "/build/_shared/chunk-BLJ6H3VR.js", "/build/_shared/chunk-UWKDBUKV.js", "/build/_shared/chunk-AAA34Y3T.js"], hasAction: !0, hasLoader: !0, hasErrorBoundary: !1 }, "routes/_app.dictionary_.add": { id: "routes/_app.dictionary_.add", parentId: "routes/_app", path: "dictionary/add", index: void 0, caseSensitive: void 0, module: "/build/routes/_app.dictionary_.add-VCXZZZRX.js", imports: ["/build/_shared/chunk-S2J4GCXK.js", "/build/_shared/chunk-UYYHSP2O.js", "/build/_shared/chunk-DQZWVC76.js", "/build/_shared/chunk-PGOH7JLP.js", "/build/_shared/chunk-BLJ6H3VR.js", "/build/_shared/chunk-UWKDBUKV.js", "/build/_shared/chunk-AAA34Y3T.js"], hasAction: !0, hasLoader: !0, hasErrorBoundary: !1 }, "routes/_app.poem": { id: "routes/_app.poem", parentId: "routes/_app", path: "poem", index: void 0, caseSensitive: void 0, module: "/build/routes/_app.poem-UKUWKTYO.js", imports: ["/build/_shared/chunk-YV45W4AE.js", "/build/_shared/chunk-6ZWHDAXP.js", "/build/_shared/chunk-BLJ6H3VR.js", "/build/_shared/chunk-UWKDBUKV.js", "/build/_shared/chunk-AAA34Y3T.js"], hasAction: !1, hasLoader: !0, hasErrorBoundary: !1 }, "routes/_app.poem.$id.delete": { id: "routes/_app.poem.$id.delete", parentId: "routes/_app.poem", path: ":id/delete", index: void 0, caseSensitive: void 0, module: "/build/routes/_app.poem.$id.delete-YUFPHQ5U.js", imports: ["/build/_shared/chunk-U5GDIAWN.js", "/build/_shared/chunk-PGOH7JLP.js"], hasAction: !0, hasLoader: !0, hasErrorBoundary: !1 }, "routes/_app.poem_.$id": { id: "routes/_app.poem_.$id", parentId: "routes/_app", path: "poem/:id", index: void 0, caseSensitive: void 0, module: "/build/routes/_app.poem_.$id-OINF5WKF.js", imports: ["/build/_shared/chunk-GO4DIL32.js", "/build/_shared/chunk-DQZWVC76.js", "/build/_shared/chunk-6ZWHDAXP.js", "/build/_shared/chunk-PGOH7JLP.js", "/build/_shared/chunk-BLJ6H3VR.js", "/build/_shared/chunk-UWKDBUKV.js", "/build/_shared/chunk-AAA34Y3T.js"], hasAction: !0, hasLoader: !0, hasErrorBoundary: !1 }, "routes/_app.poem_.add": { id: "routes/_app.poem_.add", parentId: "routes/_app", path: "poem/add", index: void 0, caseSensitive: void 0, module: "/build/routes/_app.poem_.add-6GLCY4TI.js", imports: ["/build/_shared/chunk-GO4DIL32.js", "/build/_shared/chunk-DQZWVC76.js", "/build/_shared/chunk-6ZWHDAXP.js", "/build/_shared/chunk-PGOH7JLP.js", "/build/_shared/chunk-BLJ6H3VR.js", "/build/_shared/chunk-UWKDBUKV.js", "/build/_shared/chunk-AAA34Y3T.js"], hasAction: !0, hasLoader: !0, hasErrorBoundary: !1 }, "routes/auth": { id: "routes/auth", parentId: "root", path: "auth", index: void 0, caseSensitive: void 0, module: "/build/routes/auth-I7HFXYNB.js", imports: ["/build/_shared/chunk-4TY2JQZM.js", "/build/_shared/chunk-DQZWVC76.js", "/build/_shared/chunk-PGOH7JLP.js", "/build/_shared/chunk-UWKDBUKV.js"], hasAction: !0, hasLoader: !0, hasErrorBoundary: !1 }, "routes/logout": { id: "routes/logout", parentId: "root", path: "logout", index: void 0, caseSensitive: void 0, module: "/build/routes/logout-6MFPI26G.js", imports: void 0, hasAction: !0, hasLoader: !0, hasErrorBoundary: !1 } }, version: "9b5ec363", hmr: void 0, url: "/build/manifest-9B5EC363.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "production", assetsBuildDirectory = "public\\build", future = { v3_fetcherPersist: !1 }, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/_app.dictionary.$id.delete": {
    id: "routes/_app.dictionary.$id.delete",
    parentId: "routes/_app.dictionary",
    path: ":id/delete",
    index: void 0,
    caseSensitive: void 0,
    module: app_dictionary_id_delete_exports
  },
  "routes/_app.dictionary_.$id": {
    id: "routes/_app.dictionary_.$id",
    parentId: "routes/_app",
    path: "dictionary/:id",
    index: void 0,
    caseSensitive: void 0,
    module: app_dictionary_id_exports
  },
  "routes/_app.dictionary_.add": {
    id: "routes/_app.dictionary_.add",
    parentId: "routes/_app",
    path: "dictionary/add",
    index: void 0,
    caseSensitive: void 0,
    module: app_dictionary_add_exports
  },
  "routes/_app.poem.$id.delete": {
    id: "routes/_app.poem.$id.delete",
    parentId: "routes/_app.poem",
    path: ":id/delete",
    index: void 0,
    caseSensitive: void 0,
    module: app_poem_id_delete_exports
  },
  "routes/_app.dictionary": {
    id: "routes/_app.dictionary",
    parentId: "routes/_app",
    path: "dictionary",
    index: void 0,
    caseSensitive: void 0,
    module: app_dictionary_exports
  },
  "routes/_app.poem_.$id": {
    id: "routes/_app.poem_.$id",
    parentId: "routes/_app",
    path: "poem/:id",
    index: void 0,
    caseSensitive: void 0,
    module: app_poem_id_exports
  },
  "routes/_app.poem_.add": {
    id: "routes/_app.poem_.add",
    parentId: "routes/_app",
    path: "poem/add",
    index: void 0,
    caseSensitive: void 0,
    module: app_poem_add_exports
  },
  "routes/_app._index": {
    id: "routes/_app._index",
    parentId: "routes/_app",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: app_index_exports
  },
  "routes/_app.poem": {
    id: "routes/_app.poem",
    parentId: "routes/_app",
    path: "poem",
    index: void 0,
    caseSensitive: void 0,
    module: app_poem_exports
  },
  "routes/logout": {
    id: "routes/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: logout_exports
  },
  "routes/auth": {
    id: "routes/auth",
    parentId: "root",
    path: "auth",
    index: void 0,
    caseSensitive: void 0,
    module: auth_exports
  },
  "routes/_app": {
    id: "routes/_app",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: app_exports
  }
};

// server.ts
import { createRequestHandler } from "@netlify/remix-adapter";
var handler = createRequestHandler({
  build: server_build_exports,
  mode: "production"
}), server_default = handler, config = { path: "/*", preferStatic: !0 };
export {
  config,
  server_default as default
};
