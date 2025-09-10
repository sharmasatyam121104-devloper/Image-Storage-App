import React from 'react';
import 'animate.css';
import { Download, Trash2, Upload } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { useImgStore } from './zustand/useImgStore';
import 'react-toastify/dist/ReactToastify.css';

const FIVE_MB = 5 * 1024 * 1024;

const App = () => {
  const { images, setImage, deleteImage } = useImgStore();

  const chooseFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please select an image file.", { position: "top-center" });
    }

    if (file.size > FIVE_MB) {
      return toast.error("File size too large, please upload file less than 5MB", { position: "top-center" });
    }

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      setImage({
        id: Date.now(),
        name: file.name,
        size: file.size,
        binary: fileReader.result,
        createdAt: new Date()
      });
      toast.success("New image added!");
    };
  };

  const downloadImage = (item) => {
    const a = document.createElement("a");
    a.href = item.binary;
    a.download = item.name;
    a.click();
    a.remove();
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
      <div className="w-11/12 lg:w-9/12 mx-auto py-10 space-y-16">
        <h1 className="text-4xl font-bold text-center">Image Storage</h1>

        {/* Upload button */}
        <button className="relative hover:scale-110 cursor-pointer transition-transform duration-300 hover:shadow-lg w-10/12 sm:w-8/12 mx-auto border-2 border-dashed border-white flex flex-col items-center gap-3 text-white py-10 bg-[radial-gradient(circle_at_center,_#00c6ff_0%,_#0072ff_50%,_hsl(278,66%,53%)_100%)] rounded-xl">
          <Upload className="w-16 h-16" />
          <h1 className="text-xl font-medium">Click to add image</h1>
          <input
            className="opacity-0 absolute top-0 left-0 w-full h-full rounded-xl"
            type="file"
            onChange={chooseFile}
          />
        </button>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {images.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <img
                src={item.binary}
                className="w-full h-[200px] object-cover rounded-t-xl hover:scale-110 transition-transform duration-300"
                alt={item.name}
              />
              <div className="bg-white p-3 rounded-b-xl">
                <h1 className="font-semibold truncate">{item.name}</h1>
                <p className="text-gray-600">{(item.size / 1024 / 1024).toFixed(1)} MB</p>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => downloadImage(item)}
                    className="w-8 h-8 bg-green-400 rounded flex items-center justify-center text-white hover:bg-cyan-500 transition-transform duration-300"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteImage(item.id)}
                    className="w-8 h-8 bg-rose-400 rounded flex items-center justify-center text-white hover:bg-pink-500 transition-transform duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4 mt-10">
        <p>
          Built by{" "}
          <a
            href="https://github.com/sharmasatyam121104-devloper"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Satyam Sharma
          </a>
        </p>
      </footer>

      <ToastContainer />
    </div>
  );
};

export default App;
