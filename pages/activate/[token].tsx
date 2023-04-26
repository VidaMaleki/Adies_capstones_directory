import { NextPageContext } from "next";
import { useEffect, useState} from "react";
import axios from "axios";


export default function Activate({token}: {token: string}) {
    const [error , setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        activateAccount();
    }, [token]);
    
    const activateAccount = async () => {
        try{
            const { data } = await axios.put("/api/auth/activate", {token});
            setSuccess(data)
        } catch (error) {
            setError((error as  Error).message)
        }
    }

    return <div>
        {error && (
            <div>
                <p>{error}</p>
                <button>Sign in</button>
            </div>
        )}
        {success && (
            <div>
                <p>{success}</p>
                <button>Sign in</button>
            </div>
        )}
    </div>;
}

export async function getServerSideProps(ctx: NextPageContext) {
    const {query} = ctx
    const token = query.token;
    console.log(token);
    return {
        props: {token},
    }
}