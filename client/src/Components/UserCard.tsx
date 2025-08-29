import { useAppContext } from '../Context/AppContext';

function UserCard() {
    const { user } = useAppContext();
    return (
        <div className='mx-4 shadow-xl border-1 border-[#D9D9D9] p-4 rounded-2xl flex flex-col gap-4 py-7 mt-4'>
            <h2 className='text-2xl font-bold'>Welcome, {user?.name}!</h2>
            <span>Email : {user?.email}</span>
        </div>
    )
}

export default UserCard