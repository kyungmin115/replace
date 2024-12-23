import React from "react";
import { Link } from "react-router-dom";
import "../../pages/performance/scss/PerformanceList.scss";

const PerformanceGrid = ({ performances, selectedGenres, selectedAreas }) => {
	return (
		<ul className={performances.length === 0 ? "no-data" : "performance-list"}>
			{performances.length === 0 ? (
				<li>정보가 없습니다.</li>
			) : (
				performances.map((performance) => (
					<li key={performance.pid} className="performance-card">
						<Link
							to={`/performances/${performance.pid}?genres=${selectedGenres.join(
								",",
							)}&areas=${selectedAreas.join(",")}`}>
							<img
								src={performance.posterUrl || "/path/to/default/image.jpg"}
								alt={performance.pname}
							/>
						</Link>
						<h2>{performance.pname}</h2>
						<p>공연장: {performance.fname}</p>
						<p>장르: {performance.genre}</p>
						<p>지역: {performance.area}</p>
						{performance.startDate && performance.endDate && (
							<p>
								공연 시작일: {performance.startDate} <br />
								공연 종료일: {performance.endDate}
							</p>
						)}
					</li>
				))
			)}
		</ul>
	);
};

export default PerformanceGrid;
