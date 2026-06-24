
const VendorManagement = ({ vendors }: { vendors: any[] }) => {
  const handleStatus = async (id: string, status: string) => {
    await fetch(`https://vendor-backend-kr2j.vercel.app/api/v1/admin/vendors/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    alert("Status Updated!");
  };

  return (
    <table className="w-full bg-white rounded-lg p-4">
      {vendors.map(v => (
        <tr key={v._id}>
          <td>{v.storeName}</td>
          <td>
            <button onClick={() => handleStatus(v._id, "Approved")} className="bg-green-500 text-white p-2">Approve</button>
            <button onClick={() => handleStatus(v._id, "Rejected")} className="bg-red-500 text-white p-2 ml-2">Reject</button>
          </td>
        </tr>
      ))}
    </table>
  );
};

export default VendorManagement;