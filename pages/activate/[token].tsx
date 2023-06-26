import { NextPageContext } from "next";
import { useEffect, useState ,useCallback} from "react";
import axios from "axios";
import Link from "next/link";

export default function Activate({ token }: { token: string }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const activateAccount = useCallback(async () => {
    try {
      const { data } = await axios.put("/api/auth/activate", { token });
      setSuccess(data.message);
    } catch (error: any) {
      setError((error?.response?.data as Error).message);
    }
  }, [token]);

  useEffect(() => {
    activateAccount();
  }, [activateAccount]);

  return (
    <div className='bg-black h-screen flex items-center justify-center text-center'>
      {error && (
        <div>
          <p className="text-red-500 text-xl font-bold">{error}</p>
          <div className="mt-4">
            <Link href="/" className='mt-4 bg-blue-500 text-white hover:bg-blue-700 text-md uppercase font-bold px-8 py-2 rounded'>Sign in</Link>
          </div>
        </div>
      )}
      {success && (
        <div>
          <p className="text-green-500 text-xl font-bold">{success}</p>
          <div className="mt-4">
            <Link href="/" className='mt-4 bg-blue-500 text-white hover:bg-blue-700 text-md uppercase font-bold px-8 py-2 rounded'>Sign in</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const { query } = ctx;
  const token = query.token;
  return {
    props: { token },
  };
}