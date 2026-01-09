import { useState, useEffect } from "react";
import AccountPanel from "@/Components/AccountPannel";
import Container from "@/Components/Container";
import { useSelector, useDispatch } from "react-redux";
import { fetchAddresses } from "@/app/addressSlice";
import useSession from "@/hooks/session";

export default function AccountPage() {
  const dispatch = useDispatch();
  const { addresses } = useSelector((state) => state.address);
  const {data,status}=useSession()
  const { users, isLoading, error } = useSelector((state) => state.user);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (users && data) {
      setUser(users.find((user) => user._id === data?.user._id));
    }
  }, [users, data]);


  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  return (
    <Container>
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Account</h1>
        <p className="text-muted-foreground mb-12">
          Manage your profile and addresses
        </p>

        <AccountPanel
          addresses={addresses}
          currUser={user}
        />
      </div>
    </Container>
  );
}
