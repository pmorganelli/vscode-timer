"use client";
import { useRouter } from "next/navigation";

export default function LogRows({ id, user, date, timeLogged }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/logs/${id}`);
  };

  return (
    <tr
      className="border-b hover:bg-gray-50 cursor-pointer"
      onClick={handleClick}
    >
      <td className="px-6 py-4 text-black">{user}</td>
      <td className="px-6 py-4 text-black">{date}</td>
      <td className="px-6 py-4 text-black">{timeLogged}</td>
    </tr>
  );
}