import { useState, useEffect } from 'react'
import "./App.css";
import {recipes as original} from "./recipes";
import background from "./christmas-web.jpg";
import Confetti from "./confetti";
import PureModal from 'react-pure-modal';
import 'react-pure-modal/dist/react-pure-modal.min.css';
import ReactPlayer from 'react-player/youtube';

const rand = [0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1];
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
							`${i.oz}oz ${i.n}`
						) : (
							i.n
						)}</div>)}
					</div>
				</div>
			</PureModal>;
			<div className="grid">
				{recipes.map((recipe,day) => {

					// const isOpen = (new Date().getMonth() === 11) && (day <= (new Date().getDate() - 2));
					const isOpen = true;

					return <Tile isOpen={isOpen} recipe={recipe} day={day} key={day} onClick={(date) => {
						if(date === -1){
							setOff(false);
						}
						else{
							setModal(date);
							setRecipe(recipes[date]);
						}
					}}/>
				})}
			</div>
			<div className="text">
				<div>
					Wilkes Family Advent Calendar 2022
				</div>
				<div>
					{Object.keys(ingredients).sort((a,b) => ingredients[b] - ingredients[a]).map((ingredient, i) => {
						if(ingredients[ingredient] > 0){
							return (
								<div key={i}>{ingredients[ingredient]}oz {ingredient}</div>
							);
						}
						if(ingredient.match(/^(Grapefruit|Strawberry|Lemon|Lime|Mint|Cucumber|Orange|Cream)$/ig)) {
							ingredient += ` (Dec ${recipes.map((_,i) => i).filter(i => recipes[i].ingredients.some(ing => ing.n === ingredient)).map(i => i+1).join(", ")})`
						}
						return (
							<div key={i}>{ingredient}</div>
						);
					})}
				</div>
			</div>
		</div>
		{off ? <></> : <Confetti />}
	</>)
}

export default App
