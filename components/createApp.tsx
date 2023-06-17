import { useState, ChangeEvent, FormEvent } from 'react';

type CapstoneProps = {
    signedInUser: string;
};

export default function Capstone({ signedInUser }: CapstoneProps) {
    const [appName, setAppName] = useState('');
    const [appDescription, setAppDescription] = useState('');
    const [appImage, setAppImage] = useState<File | null>(null);

    const handleAddApp = (event: FormEvent) => {
        event.preventDefault();

        // Perform the necessary logic to add the app
        // For example, you can make an API request to a backend server to save the app details
        // You can also update the app list in the user's profile or perform any additional actions

        // Reset the form fields after adding the app
        setAppName('');
        setAppDescription('');
        setAppImage(null);
    };

    const handleAppNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAppName(event.target.value);
    };

    const handleAppDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setAppDescription(event.target.value);
    };

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
        setAppImage(file);
        }
    };

    return (
        <div className="flex justify-center">
        <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow">
            <div className="w-full text-center p-4 bg-gray-100 rounded-t-lg">
                <h2 className="text-2xl font-bold">Add App</h2>
            </div>
            <form className="p-4" onSubmit={handleAddApp}>
                <div className="mb-4">
                <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="appName">
                    App Name
                </label>
                <input
                    className="w-full p-2 border border-gray-300 rounded"
                    type="text"
                    id="appName"
                    value={appName}
                    onChange={handleAppNameChange}
                />
                </div>
                <div className="mb-4">
                <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="appDescription">
                    App Description
                </label>
                <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    id="appDescription"
                    value={appDescription}
                    onChange={handleAppDescriptionChange}
                ></textarea>
                </div>
                <div className="mb-4">
                <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="appImage">
                    App Image
                </label>
                <input
                    className="w-full"
                    type="file"
                    id="appImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                />
                </div>
                <button
                className="w-full py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
                type="submit"
                >
                Add App
                </button>
            </form>
            </div>
        </div>
        </div>
    );
}