import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../assets/right-column.png";
import Logo from "../assets/logo.png";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { POST } from "../api";
import { useAppContext, type User } from "../Context/AppContext";
import Google from "../assets/google.png";
import { useGoogleLogin } from "@react-oauth/google";

function Login() {
    const navigate = useNavigate();
    const [mode, setMode] = useState<"signup" | "login">("signup");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [sendingOTP, setSendingOTP] = useState(false);
    const [verifyingOTP, setVerifyingOTP] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { setUser, setToken } = useAppContext();
    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        email: "",
    });

    const googleLogin =  useGoogleLogin({
        onSuccess: (tokenResponse) => {
            const { access_token } = tokenResponse;
            if (access_token) {
                const notify = toast.loading("Logging in...");

                setVerifyingOTP(true);
                setSendingOTP(true);
                POST<{message:string,token:string,user:User}>("/auth/google-login", { access_token })
                    .then((response) => {
                        toast.update(notify, {
                            render: `Google Login Success`,
                            type: "success",
                            isLoading: false,
                            autoClose: 3000,
                        });
                        if (response.token) {
                            localStorage.setItem("token", response.token);
                            setToken(response.token);
                        }
                        if (response.user) {
                            localStorage.setItem("user", JSON.stringify(response.user));
                            setUser(response.user);
                        }
                        navigate("/dashboard");
                    })
                    .catch((error) => {
                        console.error("Login failed:", error);
                    })
                    .finally(() => {
                        setVerifyingOTP(false);
                        setSendingOTP(false);
                    });
            }
        },
    });

    const validateForm = () => {
        if (mode === "signup") {
            if (!formData.name || formData.name.length < 3) {
                toast.error("Name must be at least 3 characters");
                return false;
            }
            if (!formData.dob || new Date(formData.dob) > new Date()) {
                toast.error("Please select a valid Date of Birth");
                return false;
            }
        }
        if (
            !formData.email ||
            !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
        ) {
            toast.error("Please enter a valid email address");
            return false;
        }
        if (otpSent && (!otp || otp.length !== 6)) {
            toast.error("Please enter a valid 6-digit OTP");
            return false;
        }
        return true;
    };

    const handleSendOtp = async () => {
        if (!validateForm()) return;
        setSendingOTP(true);

        const notify = toast.loading("Sending OTP...");
        try {
            const endpoint = mode === "signup" ? "/auth/signup" : "/auth/login";
            await POST(endpoint, formData);

            toast.update(notify, {
                render: `OTP has been sent to ${formData.email}`,
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
            setOtpSent(true);
        } catch (error: any) {
            toast.update(notify, {
                render: error?.response?.data?.message || "Failed to send OTP",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        } finally {
            setSendingOTP(false);
        }
    };

    const handleVerify = async () => {
        if (!validateForm()) return;
        setVerifyingOTP(true);

        const notify = toast.loading("Verifying OTP...");
        try {
            const response = await POST<{message:string,token:string,user:User}>("/auth/verify-otp", {
                otp,
                email: formData.email,
            });

            if (response) {
                toast.update(notify, {
                    render: response.message || "OTP Verified Successfully!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                });

                if (rememberMe) {
                    if (response.token) {
                        localStorage.setItem("token", response.token);
                    }
                    if (response.user) {
                        localStorage.setItem("user", JSON.stringify(response.user));
                    }
                } else {
                    sessionStorage.setItem("token", response.token);
                    sessionStorage.setItem("user", JSON.stringify(response.user));
                }

                setToken(response.token);
                setUser(response.user);

                navigate("/dashboard");
            }
        } catch (error: any) {
            toast.update(notify, {
                render: error?.response?.data?.message || "Failed to verify OTP",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        } finally {
            setVerifyingOTP(false);
        }
    };

    // ---------------- RESEND OTP ----------------
    const handleResendOtp = async () => {
        if (!formData.email) return toast.error("Please enter your email first!");
        setSendingOTP(true);

        const notify = toast.loading("Resending OTP...");
        try {
            await POST("/auth/login", { email: formData.email });
            toast.update(notify, {
                render: `OTP resent to ${formData.email}`,
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
        } catch (error: any) {
            toast.update(notify, {
                render: error?.response?.data?.message || "Failed to resend OTP",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        } finally {
            setSendingOTP(false);
        }
    };

    return (
        <div className="h-screen p-2">
            <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />

            <div className="flex-1 h-full flex justify-between p-2 rounded-xl ">
                <div className="flex-1 justify-center items-center">
                    <img src={Logo} alt="logo" />
                    <div className="flex justify-center items-center h-full">
                        <div className="flex w-full h-full self-center justify-center flex-col min-w-[399px] max-w-[399px] items-center gap-4">
                            <div className="text-start w-full mb-4">
                                <p className="font-inter font-bold text-3xl">
                                    {mode === "signup" ? "Sign up" : "Sign in"}
                                </p>
                                <span className="text-[#969696]">
                                    {mode === "signup"
                                        ? "Sign up and feature of HD"
                                        : "Login to access your account"}
                                </span>
                            </div>

                            {mode === "signup" && (
                                <>
                                    <TextField
                                        label="Your Name"
                                        variant="outlined"
                                        fullWidth
                                        disabled={otpSent}
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "10px",
                                            },
                                        }}
                                    />

                                    <TextField
                                        label="Date of Birth"
                                        type="date"
                                        variant="outlined"
                                        fullWidth
                                        disabled={otpSent}
                                        value={formData.dob}
                                        onChange={(e) =>
                                            setFormData({ ...formData, dob: e.target.value })
                                        }
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarTodayIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "10px",
                                            },
                                        }}
                                    />
                                </>
                            )}

                            <TextField
                                label="Email"
                                type="email"
                                variant="outlined"
                                fullWidth
                                disabled={otpSent}
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "10px",
                                    },
                                }}
                            />

                            <div className="flex w-full ps-2">
                                {mode === "login" && !otpSent && (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                            />
                                        }
                                        label="Remember me"
                                    />
                                )}

                            </div>


                            {otpSent ? (
                                <>
                                    <TextField
                                        label="Enter OTP"
                                        variant="outlined"
                                        fullWidth
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "10px",
                                            },
                                        }}
                                    />

                                    <div className="flex justify-between w-full text-sm">
                                        <span
                                            className="text-[#367AFF] underline cursor-pointer"
                                            onClick={handleResendOtp}
                                        >
                                            Resend OTP
                                        </span>
                                    </div>
                                    <div className="flex w-full ps-2">
                                        {mode === "login" && (
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={rememberMe}
                                                        onChange={(e) => setRememberMe(e.target.checked)}
                                                    />
                                                }
                                                label="Remember me"
                                            />
                                        )}
                                    </div>


                                    <Button
                                        onClick={handleVerify}
                                        fullWidth
                                        disabled={verifyingOTP}
                                        variant="contained"
                                        sx={{
                                            backgroundColor: "#367AFF",
                                            borderRadius: "10px",
                                            textTransform: "none",
                                            padding: "14px 16px",
                                        }}
                                    >
                                        Verify
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={handleSendOtp}
                                    fullWidth
                                    disabled={sendingOTP}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "#367AFF",
                                        borderRadius: "10px",
                                        textTransform: "none",
                                        padding: "14px 16px",
                                    }}
                                >
                                    {mode === "signup" ? "Get OTP" : "Send OTP"}
                                </Button>
                            )}

                            <Button
                                onClick={() => googleLogin()}
                                fullWidth
                                disabled={sendingOTP || verifyingOTP}
                                variant="contained"
                                sx={{
                                    backgroundColor: "#367AFF",
                                    borderRadius: "10px",
                                    textTransform: "none",
                                    padding: "14px 16px",
                                    gap: "5px",
                                }}
                            >
                                <img src={Google} alt="" className=" h-[20px]" />{" "}
                                {"Login using Google"}
                            </Button>

                            <div className="mt-2">
                                {mode === "signup" ? (
                                    <p>
                                        Already have an account?{" "}
                                        <span
                                            className="text-[#367AFF] underline cursor-pointer"
                                            onClick={() => {
                                                setMode("login");
                                                setOtpSent(false);
                                                setOtp("");
                                            }}
                                        >
                                            Sign in
                                        </span>
                                    </p>
                                ) : (
                                    <p>
                                        Don’t have an account?{" "}
                                        <span
                                            className="text-[#367AFF] underline cursor-pointer"
                                            onClick={() => {
                                                setMode("signup");
                                                setOtpSent(false);
                                                setOtp("");
                                            }}
                                        >
                                            Sign up
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 hidden md:flex rounded-md overflow-hidden">
                    <img
                        src={Banner}
                        className="w-full h-full object-cover overflow-hidden rounded-2xl"
                        alt="banner"
                    />
                </div>
            </div>
        </div>
    );
}

export default Login;
