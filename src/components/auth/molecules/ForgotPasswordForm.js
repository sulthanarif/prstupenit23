import React, { useState } from "react";
import InputField from "../atoms/InputField";


const ForgotPasswordForm = ({ onSubmit, errorMessage }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State debounce tombol

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit({ email });
      }
    } catch (error) {
      console.error(error);
      setIsButtonDisabled(true); // Disable tombol jika ada error
      setTimeout(() => setIsButtonDisabled(false), 1000); // Aktifkan lagi setelah 1 detik
    } finally {
      setIsLoading(false); // Reset state loading
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2">

      {/* Input Email */}
      <InputField
        type="email"
        placeholder="Masukkan Email anda"
        value={email.toLowerCase()}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Pesan Error */}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

      {/* Tombol Kirim */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          type="submit"
          className={`w-full px-11 py-3 rounded-md ${
            isLoading || isButtonDisabled || !email
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-[#008C28] text-white hover:bg-green-600"
          }`}
          style={{ borderRadius: "30px", fontWeight: "normal" }}
          disabled={isLoading || isButtonDisabled || !email}
        >
          {isLoading ? (
            <div className="loader"></div> // Loader untuk indikator loading
          ) : (
            "Kirim Kode OTP ke email"
          )}
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
