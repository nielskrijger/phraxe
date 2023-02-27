import { Link as RemixLink } from "@remix-run/react";
import { Add } from "@mui/icons-material";
import { useOptionalUser } from "~/utils/user";
import AccountMenu from "~/components/header/AccountMenu";
import SubNav from "~/components/header/SubNav";
import Link from "~/components/Link";
import Button from "~/components/Button";
import Search from "~/components/header/search/Search";

export default function Header() {
  const user = useOptionalUser();
  return (
    <>
      <header className="flex h-[50px] items-center justify-between gap-3 bg-white px-3 lg:px-5">
        <RemixLink to="/" className="font-serif text-2xl font-bold">
          phraXe
        </RemixLink>

        <Search />

        {user ? (
          <div className="flex flex-row gap-2">
            <Link to="/p/new">
              <div className="flex h-[40px] flex-row flex-nowrap items-center text-black hover:bg-slate-100 hover:text-slate-600 md:px-4">
                <span className="hidden md:inline-block">New </span>
                <Add fontSize="large" />
              </div>
            </Link>
            <AccountMenu />
          </div>
        ) : (
          <div className="flex flex-row flex-nowrap items-center gap-3">
            <RemixLink to="/signup">
              <span className="text-black hover:bg-slate-100 hover:text-slate-600 ">
                Sign up
              </span>
            </RemixLink>

            <Button to="/login">Log In</Button>
          </div>
        )}
      </header>
      <SubNav />
    </>
  );
}
