import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { setShowUserLogin, setUser } = useAppContext();
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [nickName, setNickName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [address, setAddress] = React.useState({
        sido: "",
        sigungu: "",
        road: "",
        buildingNumber: "",
        detail: "",
    });
    const [phone, setPhone] = React.useState("");
    const [showConfirmClose, setShowConfirmClose] = React.useState(false);

    const navigate = useNavigate();

    const hasUnsavedInput = () => {
        if (state === "login") {
            return email !== "" || password !== "";
        } else {
            return (
                name !== "" ||
                nickName !== "" ||
                email !== "" ||
                password !== "" ||
                phone !== "" ||
                Object.values(address).some((v) => v !== "")
            );
        }
    };

    const handleBackgroundClick = () => {
        if (hasUnsavedInput()) {
            setShowConfirmClose(true);
        } else {
            setShowUserLogin(false);
            navigate('/');
        }
    };

    const confirmClose = () => {
        setShowUserLogin(false);
        navigate('/');
    };

    const cancelClose = () => {
        setShowConfirmClose(false);
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        const fullAddress = `${address.sido} ${address.sigungu} ${address.road} ${address.buildingNumber} ${address.detail}`.trim();

            // 회원가입일 때만 API 호출
        if (state === "register") {
            try {
                const response = await fetch('/spring/member/signup', {  // 백엔드 회원가입 API 주소 (필요시 도메인 포함)
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        memEmail: email,
                        mem_addr: fullAddress,
                        mem_hp: phone,
                        mem_password: password,
                        mem_name: name,
                        mem_nickname: nickName,
                        mem_deleted: "N",
                    }),
                });

                if (!response.ok) {
                    throw new Error('회원가입 실패');
                }

                const data = await response.json();
                // 회원가입 성공하면 유저 상태 업데이트, 로그인 창 닫기
                setUser(data);
                setShowUserLogin(false);
                navigate('/');  // 가입 후 홈으로 이동

            } catch (error) {
                alert(error.message);
            }
        } else {
            try {
                const response = await fetch('/spring/member/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        memEmail: email,
                        mem_password: password,
                    }),
                });
        
                if (!response.ok) {
                    throw new Error('로그인 실패: 아이디 또는 비밀번호를 확인해주세요.');
                }
        
                const data = await response.json();
        
                // 로그인 성공 시 유저 정보 저장
                setUser(data);
                setShowUserLogin(false);
                navigate('/');
        
            } catch (error) {
                alert(error.message);
            }
        }

        setShowUserLogin(false);
    };

    return (
        <div
            onClick={handleBackgroundClick}
            className="fixed inset-0 z-50 flex items-center text-sm justify-center bg-black/50"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 relative"
            >
                <form onSubmit={onSubmitHandler} className="flex flex-col gap-4 items-start w-full">
                    <p className="text-2xl font-medium m-auto">
                        <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
                    </p>

                    {state === "register" && (
                        <div className="w-full">
                            {/* 이름 */}
                            <p>이름<span className="ml-1 text-xs text-primary select-none">(필수)</span></p>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                                type="text"
                                placeholder="Your name type here"
                                required
                            />

                            {/* 이메일 */}
                            <p className="mt-3.5">이메일<span className="ml-1 text-xs text-primary select-none">(필수)</span></p>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                                type="email"
                                placeholder="Your@Email.com"
                                required
                            />

                            {/* 비밀번호 */}
                            <p className="mt-3.5">비밀번호<span className="ml-1 text-xs text-primary select-none">(필수)</span></p>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                                type="password"
                                placeholder="Your password type here"
                                required
                            />

                            {/* 별명 */}
                            <p className="mt-3.5">별명<span className="ml-1 text-xs text-primary select-none">(선택)</span></p>
                            <input
                                onChange={(e) => setNickName(e.target.value)}
                                value={nickName}
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                                type="text"
                                placeholder="Your nickname type here"
                                required
                            />

                            {/* 핸드폰 번호 */}
                            <p className="mt-3.5">핸드폰 번호<span className="ml-1 text-xs text-primary select-none">(필수)</span></p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={3}
                                    placeholder="010"
                                    value={phone.split('-')[0] || ""}
                                    onChange={(e) => {
                                        const newValue = e.target.value.replace(/\D/g, '').slice(0, 3);
                                        const parts = phone.split('-');
                                        setPhone([newValue, parts[1] || "", parts[2] || ""].join('-'));
                                    }}
                                    className="w-1/3 border border-gray-200 rounded p-2 outline-primary text-center"
                                    required
                                />
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={4}
                                    placeholder="1234"
                                    value={phone.split('-')[1] || ""}
                                    onChange={(e) => {
                                        const newValue = e.target.value.replace(/\D/g, '').slice(0, 4);
                                        const parts = phone.split('-');
                                        setPhone([parts[0] || "", newValue, parts[2] || ""].join('-'));
                                    }}
                                    className="w-1/3 border border-gray-200 rounded p-2 outline-primary text-center"
                                    required
                                />
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={4}
                                    placeholder="5678"
                                    value={phone.split('-')[2] || ""}
                                    onChange={(e) => {
                                        const newValue = e.target.value.replace(/\D/g, '').slice(0, 4);
                                        const parts = phone.split('-');
                                        setPhone([parts[0] || "", parts[1] || "", newValue].join('-'));
                                    }}
                                    className="w-1/3 border border-gray-200 rounded p-2 outline-primary text-center"
                                    required
                                />
                            </div>

                            {/* 주소 */}
                            <div className="mt-4">
                                <p className="font-medium">주소<span className="ml-1 text-xs text-primary select-none">(필수)</span></p>

                                {/* 시도 + 시군구 */}
                                <div className="flex gap-2 mt-1">
                                    <input
                                        type="text"
                                        placeholder="시/도"
                                        value={address.sido}
                                        onChange={(e) => setAddress({ ...address, sido: e.target.value })}
                                        className="w-1/2 border border-gray-200 rounded p-2 outline-primary"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="시/군/구"
                                        value={address.sigungu}
                                        onChange={(e) => setAddress({ ...address, sigungu: e.target.value })}
                                        className="w-1/2 border border-gray-200 rounded p-2 outline-primary"
                                        required
                                    />
                                </div>

                                {/* 도로명 + 건물번호 */}
                                <div className="flex gap-2 mt-2">
                                    <input
                                        type="text"
                                        placeholder="도로명"
                                        value={address.road}
                                        onChange={(e) => setAddress({ ...address, road: e.target.value })}
                                        className="w-1/2 border border-gray-200 rounded p-2 outline-primary"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="건물번호"
                                        value={address.buildingNumber}
                                        onChange={(e) => setAddress({ ...address, buildingNumber: e.target.value })}
                                        className="w-1/2 border border-gray-200 rounded p-2 outline-primary"
                                        required
                                    />
                                </div>

                                {/* 상세주소 */}
                                <input
                                    type="text"
                                    placeholder="상세주소 (예: 3층 302호)"
                                    value={address.detail}
                                    onChange={(e) => setAddress({ ...address, detail: e.target.value })}
                                    className="mt-2 border border-gray-200 rounded w-full p-2 outline-primary"
                                />
                            </div>
                        </div>
                    )}

                    {state === "login" && (
                        <>
                            <div className="w-full">
                                <p>이메일<span className="ml-1 text-xs text-primary select-none">(필수)</span></p>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                                    type="email"
                                    placeholder="Your@Email.com"
                                    required
                                />
                            </div>

                            <div className="w-full">
                                <p>비밀번호<span className="ml-1 text-xs text-primary select-none">(필수)</span></p>
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                                    type="password"
                                    placeholder="Your password type here"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <p className="text-sm text-center w-full">
                        {state === "register" ? (
                            <>
                                Already have an account?{' '}
                                <span
                                    onClick={() => setState("login")}
                                    className="text-primary cursor-pointer"
                                >
                                    Click here
                                </span>
                            </>
                        ) : (
                            <>
                                Create an account?{' '}
                                <span
                                    onClick={() => setState("register")}
                                    className="text-primary cursor-pointer"
                                >
                                    Click here
                                </span>
                            </>
                        )}
                    </p>

                    <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                        {state === "register" ? "Create Account" : "Login"}
                    </button>
                </form>

                {showConfirmClose && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                        <div className="bg-white p-4 rounded shadow-md w-full max-w-xs text-center">
                            <p className="mb-4">입력 중인 정보가 있습니다. <br /> 정말 창을 닫으시겠습니까?</p>
                            <div className="flex justify-center gap-4">
                                <button onClick={confirmClose} className="text-white px-4 py-1.5 rounded bg-gray-400 hover:bg-gray-500">
                                    예
                                </button>
                                <button onClick={cancelClose} className="px-4 py-1.5 rounded bg-primary/80 hover:bg-primary-dull/90">
                                    아니오
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
