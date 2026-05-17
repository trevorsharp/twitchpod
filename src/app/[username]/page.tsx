import MainPage from "~/components/MainPage";

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;

  return <MainPage username={username} />;
};

export default Page;
