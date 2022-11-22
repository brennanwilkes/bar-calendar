import { useState } from 'react'
import "./curtain.css";

function Curtain() {

	const [open, setOpen] = useState(true);

	return (
		<div className="curtain-wrapper">
			<div className="curtain">
				<div className="curtain__wrapper">
					<input type="checkbox" checked={open} onChange={(e) => setOpen(!open)} />
					<div className="curtain__panel curtain__panel--left">
					</div>
					<div className="curtain__content">
					</div>
					<div className="curtain__panel curtain__panel--right">
					</div>
				</div>
			</div>
		</div>
	)
}

export default Curtain
