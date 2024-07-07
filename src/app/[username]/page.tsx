import MainPage from "~/components/MainPage";

const Page = ({ params }: { params: { username: string } }) => (
  <MainPage username={params.username} />
);

export default Page;
