import { Link as RemixLink } from "@remix-run/react";
import { Add } from "@mui/icons-material";
import { useOptionalUser } from "~/utils/user";
import AccountMenu from "~/components/Header/AccountMenu";
import SubNav from "~/components/Header/SubNav";
import Link from "~/components/Link";
import Button from "~/components/Button";

export default function Header() {
  const user = useOptionalUser();
  return (
    <>
      <header className="flex h-[50px] items-center justify-between border-b bg-white px-3 lg:px-5">
        <RemixLink to="/" className="font-serif text-2xl font-bold">
          phraXe
        </RemixLink>

        <div>
          {user ? (
            <>
              <Link to="/p/new">
                <span className="px-2 py-3 text-black hover:bg-slate-100 hover:text-slate-600 md:px-4">
                  <span className="hidden md:inline-block">New </span>
                  <Add fontSize="large" />
                </span>
              </Link>
              <AccountMenu />
            </>
          ) : (
            <div className="flex flex-row items-center gap-3">
              <RemixLink to="/signup">
                <span className="px-4 py-3 text-black hover:bg-slate-100 hover:text-slate-600 ">
                  Sign up
                </span>
              </RemixLink>

              <Button to="/login">Log In</Button>
            </div>
          )}
        </div>
      </header>
      <SubNav />
    </>
  );
}
