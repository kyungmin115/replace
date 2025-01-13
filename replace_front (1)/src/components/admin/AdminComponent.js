import React, { useState, useEffect } from "react";
import {
	getAdminMembers,
	deleteAdminMember,
	sendEmail,
} from "../../api/adminMemberApi";
import "../../styles/admin/AdminPage.scss";
// import { getCookie } from "../util/cookieUtil"

const AdminComponent = () => {
	const [members, setMembers] = useState([]); // 전체 회원 목록
	const [filteredMembers, setFilteredMembers] = useState([]); // 필터링된 회원 목록
	const [searchKeyword, setSearchKeyword] = useState(""); // 검색어
	const [onlyAgreeEmail, setOnlyAgreeEmail] = useState(false); // 이메일 수신 동의 필터
	const [selectedMembers, setSelectedMembers] = useState([]); // 선택된 회원 ({ id, email })
	const [selectAll, setSelectAll] = useState(false); // 전체 선택 상태
	const [emailSubject, setEmailSubject] = useState(""); // 이메일 제목
	const [emailBody, setEmailBody] = useState(""); // 이메일 본문

	// 회원 목록 가져오기
	useEffect(() => {
		const fetchMembers = async () => {
			try {
				const data = await getAdminMembers();
				setMembers(data);
				setFilteredMembers(data); // 초기 상태 설정
			} catch (error) {
				console.error("Failed to fetch members:", error.message);
			}
		};

		fetchMembers();
	}, []);

	// 검색 및 필터 처리
	const handleSearch = () => {
		const lowerKeyword = searchKeyword.toLowerCase();

		const filtered = members.filter((member) => {
			// 검색어가 닉네임 또는 이메일에 포함되는지 확인
			const matchesKeyword =
				member.nickname.toLowerCase().includes(lowerKeyword) ||
				member.email.toLowerCase().includes(lowerKeyword);

			// 이메일 수신 동의 필터
			const matchesAgreeEmail = onlyAgreeEmail ? !!member.agreeEmail : true;

			return matchesKeyword && matchesAgreeEmail;
		});

		setFilteredMembers(filtered);

		// 선택된 회원 상태를 필터링된 결과와 동기화
		const updatedSelected = selectedMembers.filter((m) =>
			filtered.some((member) => member.id === m.id),
		);
		setSelectedMembers(updatedSelected);
	};

	// 전체 회원 보기
	const handleShowAll = () => {
		setSearchKeyword("");
		setOnlyAgreeEmail(false);
		setFilteredMembers(members);
		setSelectedMembers([]); // 선택된 회원 초기화
	};

	// 회원 삭제
	const handleDelete = async (id) => {
		try {
			await deleteAdminMember(id);
			setMembers((prev) => prev.filter((member) => member.id !== id));
			setFilteredMembers((prev) => prev.filter((member) => member.id !== id));
			setSelectedMembers((prev) => prev.filter((m) => m.id !== id)); // 선택된 회원에서도 삭제
		} catch (error) {
			console.error("Failed to delete member:", error.message);
		}
	};

	// 회원 선택 처리 (id와 email 모두 저장)
	const handleSelectMember = (member) => {
		// 이미 선택된 회원이면 제거
		if (selectedMembers.some((m) => m.id === member.id)) {
			setSelectedMembers((prev) => prev.filter((m) => m.id !== member.id));
		} else {
			// 선택된 회원 추가
			setSelectedMembers((prev) => [
				...prev,
				{ id: member.id, email: member.email },
			]);
		}
	};

	// 전체 선택 처리
	const handleSelectAll = (checked) => {
		setSelectAll(checked);
		if (checked) {
			// 모든 회원 선택 시, id와 email을 저장
			const allMembers = filteredMembers.map((member) => ({
				id: member.id,
				email: member.email,
			}));
			setSelectedMembers(allMembers);
		} else {
			// 선택 해제
			setSelectedMembers([]);
		}
	};

	// 이메일 발송
	const handleSendEmails = async () => {
		if (selectedMembers.length === 0) {
			alert("이메일을 발송할 회원을 선택해주세요.");
			return;
		}

		if (!emailSubject || !emailBody) {
			alert("이메일 제목과 본문을 입력해주세요.");
			return;
		}

		// ★ 이메일 주소만 추출
		const emailAddresses = selectedMembers.map((m) => m.email);

		try {
			await sendEmail(emailAddresses, emailSubject, emailBody);
			alert("이메일 발송 성공!");
		} catch (error) {
			console.error("Failed to send emails:", error.message);
			alert("이메일 발송 실패: " + error.message);
		}
	};

	// 전체 선택 상태 동기화
	useEffect(() => {
		setSelectAll(
			filteredMembers.length > 0 &&
				filteredMembers.every((member) =>
					selectedMembers.some((m) => m.id === member.id),
				),
		);
	}, [filteredMembers, selectedMembers]);

	return (
		<div className="admin-container">
			<h2>회원 관리</h2>

			{/* 회원 요약 정보 1010추가 */}
			<div className="member-summary">
				<p>총 회원 수: {members.length}</p>
				<div>
					이메일 수신 동의 회원 수:{" "}
					{members.filter((member) => member.agreeEmail).length}명 / 총 회원 :{" "}
					{members.length}명 (
					{(
						(members.filter((member) => member.agreeEmail).length / members.length) *
						100
					).toFixed(1)}
					%)
				</div>
			</div>
			{/* 검색 및 필터링 필드 */}
			<div className="search-section">
				<input
					type="text"
					placeholder="닉네임 또는 이메일 검색"
					value={searchKeyword}
					onChange={(e) => setSearchKeyword(e.target.value)}
				/>
				<div className="checkbox-wrapper">
					<input
						type="checkbox"
						checked={onlyAgreeEmail}
						onChange={(e) => setOnlyAgreeEmail(e.target.checked)}
					/>
					이메일 수신 동의 회원만 보기
				</div>
				<button onClick={handleSearch}>검색</button>
				<button onClick={handleShowAll}>전체 회원 보기</button>
			</div>

			{/* 이메일 발송 UI */}
			{onlyAgreeEmail && (
				<div className="email-section">
					<h3>이메일 발송</h3>
					<div className="email-form">
						<input
							type="text"
							placeholder="제목"
							value={emailSubject}
							onChange={(e) => setEmailSubject(e.target.value)}
						/>
						<textarea
							placeholder="본문"
							value={emailBody}
							onChange={(e) => setEmailBody(e.target.value)}
						/>
						<button onClick={handleSendEmails}>선택된 회원에게 이메일 발송</button>
					</div>
				</div>
			)}

			<table className="members-table">
				<thead>
					<tr>
						<th className="checkbox-cell">
							<input
								type="checkbox"
								checked={selectAll}
								onChange={(e) => handleSelectAll(e.target.checked)}
							/>
						</th>
						<th>ID</th>
						<th>이메일</th>
						<th>닉네임</th>
						<th>역할</th>
						<th>수신 동의</th>
						<th>관리</th>
					</tr>
				</thead>
				<tbody>
					{filteredMembers.map((member) => (
						<tr key={member.id}>
							<td>
								<input
									type="checkbox"
									checked={selectedMembers.some((m) => m.id === member.id)}
									onChange={() => handleSelectMember(member)}
								/>
							</td>
							<td>{member.id}</td>
							<td>{member.email}</td>
							<td>{member.nickname}</td>
							<td>{member.roles.join(", ")}</td>
							<td>{member.agreeEmail ? "✔️" : "❌"}</td>
							<td>
								<button onClick={() => handleDelete(member.id)}>삭제</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<div>
				<a
					href="https://admin.portone.io/payments"
					target="_blank"
					rel="noopener noreferrer">
					<button className="portone">관리자 결제 목록</button>
				</a>
			</div>
		</div>
	);
};

export default AdminComponent;
