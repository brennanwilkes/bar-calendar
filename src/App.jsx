import { useState, useEffect, useRef } from 'react'
import "./App.css";
import {recipes as original} from "./recipes";
import background from "./christmas-web.jpg";
import Confetti from "./confetti";
import ReactPlayer from 'react-player';

const rand = [1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0];
let recipes = original.sort((a,b) => a.sort - b.sort);

const Tile = (props) => {

	const [isOpen, setIsOpen] = useState(props.isOpen);

	return (
		<div onClick={() => {
			if(isOpen && props.onClick && isOpen){
				props.onClick(props.day);
			}
			else if(props.day === (new Date().getDate() - 1)){
				if(props.onClick && !isOpen){
					props.onClick(-1);
				}
				setIsOpen(true);
			}
		}} className={`tile ${isOpen ? "open" : "closed"} b${rand[props.day]}`}>
			<div className="video">
				<img alt="" src={`https://img.youtube.com/vi/${props.recipe.id}/mqdefault.jpg`} />
			</div>
			<div className="name">{props.recipe.name}</div>
			<div className="day">{props.day + 1}</div>
		</div>
	);
}

const ingredients = {};
recipes.map(r => r.ingredients).flat().forEach((ingredient, i) => {
	if(!ingredients[ingredient.n]){
		ingredients[ingredient.n] = 0;
	}
	ingredients[ingredient.n] += (ingredient.oz ?? 0);
});

function toFraction(amount) {
    const whole = Math.floor(amount);
    const fraction = amount - whole;
    const denom = [2, 3, 4, 5, 6, 8].find(d => Math.abs(Math.round(fraction * d) / d - fraction) < 0.01);
    const fractionString = denom && Math.round(fraction * denom) > 0 
        ? `${Math.round(fraction * denom)}/${denom}` 
        : "";

    if (whole && fractionString) return `${whole} ${fractionString}`;
    if (whole) return `${whole}`;
    return fractionString || "0";
}


function App() {

	const [off, setOff] = useState(true);
	const [modal, setModal] = useState(-1);
	const [recipe, setRecipe] = useState(recipes[0]);
	const dialog = useRef(null);

	useEffect(() => {
		const d = dialog.current;
		if(modal > -1 && !d.open) d.showModal();
		if(modal === -1 && d.open) d.close();
	}, [modal]);

	useEffect(() => {
		if(!off){
			setTimeout(() => {
				setOff(true);
			}, 6000);
		}
	}, [off]);


	return (<>
		<div className="backdrop" style={{ backgroundImage: `url(${background})` }} />
		<div className="App">
			<dialog
				ref={dialog}
				className="recipe-dialog"
				onClose={() => setModal(-1)}
				onClick={(e) => { if(e.target === e.currentTarget) dialog.current.close(); }}>
				{modal > -1 && <div id="modalInner">
					<button className="close" autoFocus onClick={() => dialog.current.close()}>Close</button>
					<div id="title">{recipe?.name}</div>
					<div id="video"><ReactPlayer controls src={`https://www.youtube.com/watch?v=${recipe.id}`} width="100%" height="100%" />
					</div>
					<div id="recipe">
						<div className="label">Ingredients</div>
						{recipe.ingredients.map((i,j) => (
							<div className="item" key={j}>
								<span className="qty">{i.oz ? `${toFraction(i.oz)} oz` : ""}</span>
								<span>{i.n}{i.annotation && <span className="hint"> {i.annotation}</span>}</span>
							</div>
						))}
					</div>
					</div>}
			</dialog>
			<div className="grid">
				{recipes.map((recipe,day) => {

					const isOpen = (new Date().getMonth() === 11) && (day <= (new Date().getDate() - 2));
					// const isOpen = true;

					return <Tile isOpen={isOpen} recipe={recipe} day={day} key={day} onClick={(date) => {
						if(date === -1){
							setOff(false)
						}
						else{
							setModal(date)
							setRecipe(recipes[date])
						}
					}}/>
				})}
			</div>
			<div className="text">
				<h1>
					Wilkes Family Advent Calendar 2024
				</h1>
				<div className="shopping">
					{Object.keys(ingredients).sort((a,b) => ingredients[b] - ingredients[a]).map((ingredient, i) => {
						const oz = ingredients[ingredient];
						const fresh = !oz && ingredient.match(/^(Grapefruit|Strawberry|Lemon|Lime|Mint|Cucumber|Orange|Cream|Vanilla Ice Cream|Salt|Egg White|Nutmeg)$/i);
						const days = fresh && recipes.map((_,i) => i).filter(i => recipes[i].ingredients.some(ing => ing.n === ingredient)).map(i => i+1).join(", ");
						return (
							<div className="item" key={i}>
								<span className="qty">{oz > 0 ? `${toFraction(oz)} oz` : fresh && <span className="hint">Dec {days}</span>}</span>
								<span>{ingredient}</span>
							</div>
						)
					})}
				</div>
			</div>
		</div>
		{off ? <></> : <Confetti />}
	</>)
}

export default App
