function Rows({ rank, name, timeSpent }) {
    return (
      <tr className="border-b hover:bg-gray-50">
        <td className="px-6 py-4 text-black">{rank}</td>
        <td className="px-6 py-4 text-black">{name}</td>
        <td className="px-6 py-4 text-black">{timeSpent}</td>
      </tr>
    );
}
export default Rows;