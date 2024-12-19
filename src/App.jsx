import { useState, useEffect } from 'react'
import "./App.css";
import {recipes as original} from "./recipes";
import background from "./christmas-web.jpg";
import Confetti from "./confetti";
import PureModal from 'react-pure-modal';
import 'react-pure-modal/dist/react-pure-modal.min.css';
import ReactPlayer from 'react-player/youtube';

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
		}} className={`${isOpen ? "open" : "closed"} b${rand[props.day]}`}>
			<div className="video">
				<img style={{
					pointerEvents: "none"
				}} src={`https://img.youtube.com/vi/${props.recipe.id}/mqdefault.jpg`} />
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

	useEffect(() => {
		if(!off){
			setTimeout(() => {
				setOff(true);
			}, 6000);
		}
	}, [off]);


	return (<>
		<div style={{
			width: "100vw",
			height: "100vh",
			postion: "absolute",
			backgroundImage: `url(${background})`,
			backgroundSize: "cover",
			filter: "blur(4px)"
		}}>
		</div>
		<div className="App">
			<PureModal
				header="Your header"
				replace={true}
				isOpen={modal > -1}
				closeButton="close"
				closeButtonPosition="bottom"
				width={"90vw"}
				onClose={() => {
					setModal(-1);
					return true;
				}}>
				<div id="modalInner">
					<div id="title">{recipe?.name}</div>
					<div id="video"><ReactPlayer controls={true} url={`https://www.youtube.com/watch?v=${recipe.id}`} />
					</div>
					<div id="recipe">
						<div>Ingredients</div>
						{recipe.ingredients.map((i,j) => <div key={j}>{(!!(i.oz)) ? (
							`${toFraction(i.oz)}oz ${i.n}${i.annotation ? ` (${i.annotation})`: ""}`
						) : (
							i.n
						)}</div>)}
					</div>
				</div>
			</PureModal>
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
				<div>
					Wilkes Family Advent Calendar 2024
				</div>
				<div>
					{Object.keys(ingredients).sort((a,b) => ingredients[b] - ingredients[a]).map((ingredient, i) => {
						if(ingredients[ingredient] > 0){
							return (
								<div key={i}>{toFraction(ingredients[ingredient])}oz {ingredient}</div>
							)
						}
						if(ingredient.match(/^(Grapefruit|Strawberry|Lemon|Lime|Mint|Cucumber|Orange|Cream|Vanilla Ice Cream|Salt|Egg White|Nutmeg)$/ig)) {
							ingredient += ` (Dec ${recipes.map((_,i) => i).filter(i => recipes[i].ingredients.some(ing => ing.n === ingredient)).map(i => i+1).join(", ")})`
						}
						return (
							<div key={i}>{ingredient}</div>
						)
					})}
				</div>
			</div>
		</div>
		{off ? <></> : <Confetti />}
	</>)
}

export default App
