import { db } from '@/lib/db'

interface Props {
  developer: {
    id: number;
    fullName: string;
    email: string;
    linkedin: string;
    image: string;
    createdAt: string
  }
}

export default function ProfilePage({ developer }: Props) {
  return (
    <div className="bg-white rounded-md shadow-md p-6">
      <h1 className="text-2xl font-bold mb-4">{developer.fullName}'s Profile</h1>
      {developer.image && <img src={developer.image} className="w-48 h-48 rounded-full mb-4" />}
      <div className="flex flex-col mb-4">
        <span className="text-lg font-bold">Name:</span>
        <span className="text-lg">{developer.fullName}</span>
      </div>
      <div className="flex flex-col mb-4">
        <span className="text-lg font-bold">Email:</span>
        <span className="text-lg">{developer.email}</span>
      </div>
      {developer.linkedin && (
        <div className="flex flex-col mb-4">
          <span className="text-lg font-bold">Bio:</span>
          <p className="text-lg">{developer.linkedin}</p>
        </div>
      )}
      <div className="flex flex-col mb-4">
        <span className="text-lg font-bold">Joined:</span>
        <span className="text-lg">{new Date(developer.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  )
}

export const GetServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { username } = context.query

  const user = await db.developer.findUnique({
    where: { email: username as string },
    select: {
      id: true,
      username: true,
      fullName: true,
      email: true,
      bio: true,
      imageUrl: true,
      createdAt: true,
    },
  })

  return {
    props: {
      user,
    },
  }
}