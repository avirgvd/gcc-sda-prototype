import { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  LoaderFunction,
  ActionFunction,
} from "react-router-dom";
import { Grommet } from "grommet-exp";
import { Grommet as OldGrommet } from "grommet";
import { hpe } from "grommet-theme-hpe";
import { Login } from "./components/Login";
import { AppHeader } from "./components/AppHeader";
interface IRoute {
  path: string;
  Element: JSX.Element;
  loader?: LoaderFunction;
  action?: ActionFunction;
  ErrorBoundary?: JSX.Element;
}

const pages = import.meta.glob("./pages/**/*.tsx", { eager: true });

const routes: IRoute[] = [];
for (const path of Object.keys(pages)) {
  const fileName = path.match(/\.\/pages\/(.*)\.tsx$/)?.[1];
  console.log(fileName);
  if (!fileName) {
    continue;
  }

  const normalizedPathName = fileName.includes("$")
    ? fileName.replace("$", ":")
    : fileName.replace(/\/index/, "");

    console.log(normalizedPathName);

  routes.push({
    path: fileName === "index" ? "/" : `/${normalizedPathName.toLowerCase()}`,
    // @ts-ignore
    Element: pages[path].default,
    // @ts-ignore
    loader: pages[path]?.loader as unknown as LoaderFunction | undefined,
    // @ts-ignore
    action: pages[path]?.action as unknown as ActionFunction | undefined,
    // @ts-ignore
    ErrorBoundary: pages[path]?.ErrorBoundary as unknown as JSX.Element,
  });
}

const router = createBrowserRouter(
  routes.map(({ Element, ErrorBoundary, ...rest }) => ({
    ...rest,
    // @ts-ignore
    element: <Element />,
    // @ts-ignore
    ...(ErrorBoundary && { errorElement: <ErrorBoundary /> }),
  }))
);

const App = () => {
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("hpe-design-experiment") || false
  );

  useEffect(() => {
    if (localStorage.getItem("hpe-design-experiment")) setAuthenticated(true);
  }, []);

  return (
    <Grommet>
      <OldGrommet theme={hpe} background="background-back" full="min">
        {authenticated ? (
          <AppHeader>
          <RouterProvider router={router} />
          </AppHeader>
        ) : (
          <Login setAuthenticated={setAuthenticated} />
        )}
      </OldGrommet>
    </Grommet>
  );
};

export default App;
