import MainPage from "~/components/MainPage";

export const runtime = "edge";

type PageProps = {
  params: { username: string };
};

const Page = ({ params }: PageProps) => <MainPage username={params.username} />;

export default Page;
