import SubNavItem from "~/components/Header/SubNavItem";

export default function SubNav() {
  return (
    <nav className="flex justify-center border-b bg-white">
      <div className="flex w-full max-w-6xl flex-row">
        <SubNavItem to="/">Home</SubNavItem>
        <SubNavItem to="/top">Top rated</SubNavItem>
        <SubNavItem to="/liked">Most liked</SubNavItem>
      </div>
    </nav>
  );
}
