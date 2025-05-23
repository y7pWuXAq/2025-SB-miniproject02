// src/components/ChangePasswordModal.jsx

import React, { useState } from 'react';

const ChangePasswordModal = ({ onClose, userEmail }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // 입력 시 에러 메시지 초기화
        setSuccess(''); // 입력 시 성공 메시지 초기화
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const { currentPassword, newPassword, confirmNewPassword } = formData;

        // 1. 프론트엔드 유효성 검사
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setError('모든 필드를 입력해주세요.');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setError('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        if (newPassword.length < 8) { // 최소 길이 검사 (예시)
            setError('새 비밀번호는 최소 8자 이상이어야 합니다.');
            return;
        }
        // 더 복잡한 비밀번호 강도 검사는 필요에 따라 추가

        // 2. 백엔드 API 호출
        try {
            // 백엔드 비밀번호 변경 API 경로: /spring/member/update1
            // 현재 비밀번호를 보낼 필요가 없는 백엔드 API이므로 newPassword만 보냅니다.
            // (하지만 보안상 현재 비밀번호 검증은 백엔드에서 반드시 필요합니다!)
            const response = await fetch(`/spring/member/update1`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` // JWT 사용 시 토큰 포함
                },
                body: JSON.stringify({
                    memEmail: userEmail, // 사용자 식별을 위한 이메일
                    mem_password: newPassword, // 백엔드의 MemberDTO 필드명과 일치
                }),
            });

            if (!response.ok) {
                // 백엔드에서 에러 메시지를 반환하는 경우
                const errorData = await response.json();
                throw new Error(errorData.message || '비밀번호 변경 실패');
            }

            // 성공 응답 처리
            setSuccess('비밀번호가 성공적으로 변경되었습니다!');
            // 성공 후 모달 닫기
            setTimeout(() => {
                onClose();
            }, 1500); // 1.5초 후 닫기
        } catch (err) {
            console.error('비밀번호 변경 에러:', err);
            setError(err.message || '비밀번호 변경 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="fixed inset-0 z-40 flex justify-center items-center" onClick={onClose}>
            <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur"></div>

            <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-primary text-center mb-4">비밀번호 변경</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 현재 비밀번호 필드 - 백엔드에서 검증하지 않지만, UX를 위해 유지 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">현재 비밀번호</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">새 비밀번호</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">새 비밀번호 확인</label>
                        <input
                            type="password"
                            name="confirmNewPassword"
                            value={formData.confirmNewPassword}
                            onChange={handleChange}
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    {success && <p className="text-green-500 text-sm mt-2">{success}</p>}

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer">
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary hover:bg-primary-dull text-white rounded-md cursor-pointer">
                            비밀번호 변경
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;