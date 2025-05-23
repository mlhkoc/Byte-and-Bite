import { useState } from "react";

const RestaurantProfilePage = () => {
  const [name, setName] = useState("res1");
  const [address, setAddress] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSave = () => {
    // Şimdilik sadece frontend
    console.log({ name, address, imageUrl });
    alert("Bilgiler kaydedildi!");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Restaurant Profile</h2>

      <label className="block mb-1 font-medium">Restaurant Name</label>
      <input
        type="text"
        className="border p-2 w-full mb-4 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label className="block mb-1 font-medium">Address</label>
      <input
        type="text"
        className="border p-2 w-full mb-4 rounded"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <label className="block mb-1 font-medium">Image URL</label>
      <input
        type="text"
        className="border p-2 w-full mb-4 rounded"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      {imageUrl && (
        <img src={imageUrl} alt="Preview" className="mb-4 w-32 h-32 object-cover rounded" />
      )}

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  );
};

export default RestaurantProfilePage;
