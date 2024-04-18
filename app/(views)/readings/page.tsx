import { Metadata } from "next";
import appConfig from "app.config";
import dynamic from "next/dynamic";
import Loading from "components/loading";
// import { TarotSession } from "./components/tarot-session";

const Readings = dynamic(() => import("./components/readings"), {
  loading: () => (
    <div className="dark flex h-screen items-center justify-center bg-black">
      <Loading />
    </div>
  ),
  ssr: false,
});

export const metadata: Metadata = {
  title: appConfig.appName,
  description: appConfig.description,
};

export default async function Page() {
  return <Readings />;
}
