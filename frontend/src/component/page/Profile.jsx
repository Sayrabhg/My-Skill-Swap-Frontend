import { useEffect, useState } from "react";
import { getProfile, updateProfile, getSkillsByUserId, uploadPdf, uploadBgImg } from "../../api/api";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Globe, Phone, AtSign, MapPin, Github, Linkedin, X, ArrowLeft } from "lucide-react";
import Loading from "./components/Loading";
import userImg from "@/assets/no_user.jpg";
import StatusDialog from "./components/StatusDialog";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBioDialog, setShowBioDialog] = useState(false);
    const [newBio, setNewBio] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [dialogType, setDialogType] = useState("success");
    const [dialogMessage, setDialogMessage] = useState("");
    const [bioLoading, setBioLoading] = useState(false);
    const [showMsgDialog, setShowMsgDialog] = useState(false);
    const [msgText, setMsgText] = useState("");
    const [bgUploading, setBgUploading] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const navigate = useNavigate();
    const [resumeUploading, setResumeUploading] = useState(false);

    const handleBgUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setMsgText("Only image files allowed");
            setShowMsgDialog(true);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setBgUploading(true);

            // 🔥 create API like uploadBgImage
            const res = await uploadBgImg(formData); // replace with uploadBgImage API

            const updatedUser = {
                ...user,
                bgImg: res.data
            };

            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            setDialogMessage("Background image updated!");
            setDialogType("success");
            setShowDialog(true);

        } catch (err) {
            console.error(err);
            setDialogMessage("Failed to upload image");
            setDialogType("error");
            setShowDialog(true);
        } finally {
            setBgUploading(false);
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            setMsgText("Only PDF files allowed");
            setShowMsgDialog(true);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setResumeUploading(true);

            const res = await uploadPdf(formData);

            const updatedUser = {
                ...user,
                resumePdf: res.data,
                resumePdfName: file.name
            };

            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            setMsgText("Resume uploaded successfully!");
            setShowMsgDialog(true);

        } catch (error) {
            console.error(error);
            setMsgText("Resume upload failed.");
            setShowMsgDialog(true);
        } finally {
            setResumeUploading(false);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getProfile();
                setUser(res.data);
                localStorage.setItem("user", JSON.stringify(res.data));

                // fetch skills using user id
                const skillsRes = await getSkillsByUserId(res.data.id);
                setSkills(skillsRes.data);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) return <Loading message="Loading profile..." />;

    const handleBioSave = async () => {
        try {
            setBioLoading(true);
            const updatedUser = { ...user, bio: newBio };
            const res = await updateProfile(updatedUser);
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));

            // Close bio dialog
            setShowBioDialog(false);

            // Show success message
            setMsgText("Bio updated successfully!");
            setShowMsgDialog(true);
        } catch (error) {
            console.error(error);
            setMsgText("Failed to update bio.");
            setShowMsgDialog(true);
        } finally {
            setBioLoading(false);
        }
    };

    const handleDialogClose = () => {
        setShowDialog(false);
        dialogMessage === "Profile updated successfully"
    };

    return (
        <div className="min-h-screen bg-violet-50 pb-3">
            <div className="absolute top-26 left-6 z-1">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:scale-110 rounded-full shadow-md hover:bg-indigo-200 transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
            </div>

            {/* Cover Section */}
            <div className="relative h-56 w-full group" onClick={() => setShowOverlay(!showOverlay)}>

                {/* Background Image */}
                <img
                    src={user.bgImg || "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d"}
                    alt="cover"
                    className="w-full h-full object-cover"
                />

                {/* Overlay on hover */}
                {showOverlay && (
                    <div
                        className="absolute inset-0 bg-black/40 flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()} // ✅ IMPORTANT
                    >
                        <label
                            htmlFor="bgUpload"
                            className="cursor-pointer bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-gray-200"
                        >
                            {bgUploading ? "Uploading..." : "Change Image"}
                            <input
                                type="file"
                                accept="image/*"
                                id="bgUpload"
                                className="cursor-pointer z-1 absolute left-0 right-0 bg-red-500 opacity-0"
                                onChange={handleBgUpload}
                            />
                        </label>

                    </div>
                )}

                {/* Profile Info */}
                <div className="absolute inset-0 flex items-end justify-start p-6">
                    <img
                        src={user.avatar || userImg}
                        alt="avatar"
                        className="w-20 h-20 lg:w-32 lg:h-32 rounded-full border-4 border-white shadow-lg -mb-22"
                    />
                    <div className="lg:ml-6 -mb-12 text-white gap-2 grid">
                        <h1 className="text-sm lg:text-2xl bg-[#83838342] p-2 rounded-lg shadow-xl font-bold">
                            {user.name}
                        </h1>
                        <p className="text-gray-900">{user.email}</p>
                    </div>
                </div>

            </div>

            {/* Stats Section */}
            <div className="max-w-5xl mx-auto px-6 mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow rounded-xl p-4 text-center">
                    <p className="text-gray-500">Role</p>
                    <p className="font-semibold text-lg">{user.role}</p>
                </div>
                <div className="bg-white shadow rounded-xl p-4 text-center">
                    <p className="text-gray-500">Tokens</p>
                    <p className="font-semibold text-lg">{user.tokens}</p>
                </div>
                <div className="bg-white shadow rounded-xl p-4 text-center">
                    <p className="text-gray-500">Trust Score</p>
                    <p className="font-semibold text-lg">{user.trustScore}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-6 mt-6 grid md:grid-cols-2 gap-6">

                {/* Bio Card */}
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">Bio</h3>
                        <Pencil
                            size={18}
                            className="text-gray-400 cursor-pointer"
                            onClick={() => {
                                setNewBio(user.bio || "");
                                setShowBioDialog(true);
                            }}
                        />
                    </div>
                    <p className="text-gray-600">{user.bio || "No bio provided."}</p>
                </div>

                {/* Skills Card */}
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {skills.length > 0 ? (
                            skills.map((skill) => (
                                <span
                                    key={skill.id}
                                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                                >
                                    {skill.skillOffered}
                                </span>
                            ))
                        ) : (
                            <p className="text-gray-500">No skills added.</p>
                        )}
                    </div>
                </div>

                {/* Contact & Info Card */}
                <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Contact & Info</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                        <div className="flex items-start gap-2">
                            <Phone size={16} className="mt-1 shrink-0" />
                            <span className="break-words text-left">{user.mobileNumber || "Not provided"}</span>
                        </div>

                        <div className="flex items-start gap-2">
                            <MapPin size={16} className="mt-1 shrink-0" />
                            <span className="break-words text-left">
                                {user.address || "Not provided"}, {user.city || "-"}, {user.state || "-"}, {user.country || "-"}, {user.postalCode || "-"}
                            </span>
                        </div>

                        <div className="flex items-start gap-2">
                            <Globe size={16} className="mt-1 shrink-0" />
                            <a
                                href={user.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline break-all text-left"
                            >
                                {user.website || "Not provided"}
                            </a>
                        </div>

                        <div className="flex items-start gap-2">
                            <Linkedin size={16} className="mt-1 shrink-0" />
                            <a
                                href={user.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline break-all text-left"
                            >
                                {user.linkedin || "Not provided"}
                            </a>
                        </div>

                        <div className="flex items-start gap-2">
                            <Github size={16} className="mt-1 shrink-0" />
                            <a
                                href={user.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline break-all text-left"
                            >
                                {user.github || "Not provided"}
                            </a>
                        </div>

                        <div className="flex items-start gap-2">
                            <AtSign size={16} className="mt-1 shrink-0" />
                            <span className="text-left">Gender: {user.gender || "Not provided"}</span>
                        </div>
                    </div>
                </div>

                {/* Resume Card */}
                {/* <div className="bg-white rounded-xl shadow p-6 md:col-span-2">

                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Resume</h3>

                        {/* Upload Button *
                        <label
                            htmlFor="resumeUpload"
                            className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                            Upload
                        </label>
                    </div>

                    {/* Hidden Input *
                    <input
                        type="file"
                        accept="application/pdf"
                        id="resumeUpload"
                        style={{ display: "none" }}
                        onChange={handleResumeUpload}
                    />

                    {/* Loader *
                    {resumeUploading && (
                        <div className="flex items-center gap-2 text-gray-500 mb-3">
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            Uploading resume...
                        </div>
                    )}

                    {/* File Info *
                    {user.resumePdf ? (
                        <div className="flex flex-col gap-2">

                            <p className="text-gray-700">
                                📄 {user.resumePdfName || "Resume.pdf"}
                            </p>

                            <div className="flex gap-4">
                                <a
                                    href={user.resumePdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    View
                                </a>

                                <a
                                    href={user.resumePdf}
                                    download={user.resumePdfName}
                                    className="text-green-600 hover:underline"
                                >
                                    Download
                                </a>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">No resume uploaded.</p>
                    )}

                </div> */}


                {/* Edit Full Profile Button */}
                <div className="flex md:col-span-2 justify-center">
                    <Link to="/profile/edit">
                        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                            <Pencil size={16} />
                            Edit Profile
                        </Button>
                    </Link>
                </div>

            </div>
            {/* Mini Bio Dialog */}
            {showBioDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Edit Bio</h3>
                            <X className="cursor-pointer" onClick={() => setShowBioDialog(false)} />
                        </div>
                        <textarea
                            className="w-full border rounded-lg p-2 mb-4"
                            rows={4}
                            value={newBio}
                            onChange={(e) => setNewBio(e.target.value)}
                            placeholder="Update your bio..."
                        />
                        <Button
                            className="w-full"
                            onClick={handleBioSave}
                            disabled={bioLoading}
                        >
                            {bioLoading ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </div>
            )}

            {/* Message Dialog */}
            {showMsgDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center animate-slideFromLeft">
                        <p className="mb-4">{msgText}</p>
                        <Button className="w-full" onClick={() => setShowMsgDialog(false)}>
                            OK
                        </Button>
                    </div>
                </div>
            )}

            <StatusDialog
                open={showDialog}
                type={dialogType}
                message={dialogMessage}
                onClose={handleDialogClose}
            />

        </div>
    );
}