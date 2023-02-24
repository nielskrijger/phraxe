import SubNavItem from "~/components/Header/SubNavItem";

export default function SubNav() {
  return (
    <nav className="flex justify-center border-y border-slate-100 bg-slate-50">
      <div className="flex w-full max-w-6xl flex-row">
        <SubNavItem to="/">Home</SubNavItem>
        <SubNavItem to="/top">Top</SubNavItem>
      </div>
    </nav>
  );
}
