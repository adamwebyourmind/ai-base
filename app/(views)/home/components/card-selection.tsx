import { useState, useEffect } from "react";
import { tarotDeck } from "./tarot-deck";
import "./cards.css";
import { Button } from "components/ui/button";
import { IconRotate } from "components/ui/icons";
import Card from "./tarot-card";

interface CardSelectionProps {
  onSelect: (cardName: string, orientation: "upright" | "reversed") => void;
  currentStep: number;
  query: string;
}

const shuffleArray = (array: any[]) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const createShuffledDeck = () => {
  return shuffleArray(
    tarotDeck.map((card) => ({
      name: card,
      orientation: Math.random() > 0.5 ? "upright" : "reversed",
    }))
  );
};

const CardSelection = ({ onSelect, query, currentStep }: CardSelectionProps) => {
  const [deck, setDeck] = useState<{ name: string; orientation: "upright" | "reversed" }[]>(createShuffledDeck());
  const [leftDeck, setLeftDeck] = useState<{ name: string; orientation: "upright" | "reversed" }[]>([]);
  const [rightDeck, setRightDeck] = useState<{ name: string; orientation: "upright" | "reversed" }[]>([]);
  const [finalCard, setFinalCard] = useState<{ name: string; orientation: "upright" | "reversed" }>();

  useEffect(() => {
    resetSelection(); // Reset to initial state on component mount
  }, [currentStep]);

  const resetSelection = () => {
    const shuffledDeck = deck;
    const midPoint = Math.ceil(shuffledDeck.length / 2);
    setLeftDeck(shuffledDeck.slice(0, midPoint));
    setRightDeck(shuffledDeck.slice(midPoint));
    setFinalCard(null);
  };

  useEffect(() => {
    const shuffledDeck = deck;
    const midPoint = Math.ceil(shuffledDeck.length / 2);
    setLeftDeck(shuffledDeck.slice(0, midPoint));
    setRightDeck(shuffledDeck.slice(midPoint));
  }, []);

  const onFinalCard = (card) => {
    setFinalCard(card);
  };

  const switchOrientation = () => {
    setFinalCard({ ...finalCard, orientation: finalCard.orientation === "upright" ? "reversed" : "upright" });
  };

  const handleSelectHalf = (half: "left" | "right") => {
    // Determine the selected deck based on the user's choice.
    let selectedDeck = half === "left" ? [...leftDeck] : [...rightDeck];

    // If the selected deck has only one card, it's the final selection.
    if (selectedDeck.length === 1) {
      // onSelect(selectedDeck[0].name, selectedDeck[0].orientation); // Call onSelect with the final card.
      setDeck(deck.filter((card) => card.name !== selectedDeck[0].name));
      onFinalCard(selectedDeck[0]);
      return;
    }

    // Split the selected deck into new halves.
    const midPoint = Math.ceil(selectedDeck.length / 2);
    const newLeftDeck = selectedDeck.slice(0, midPoint); // First half becomes the new left deck.
    const newRightDeck = selectedDeck.slice(midPoint); // Second half becomes the new right deck.

    // Update the state with the new decks.
    setLeftDeck(newLeftDeck);
    setRightDeck(newRightDeck);
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center pb-10 transition-opacity">
      <p className="mx-10 mb-4 text-center italic">{query}</p>
      {finalCard ? (
        <>
          <p className="mb-4 max-w-sm text-center font-serif text-xl md:mb-10">Which way is your card?</p>
          <button onClick={() => switchOrientation()} className="p-4 transition hover:scale-105">
            <div className="rounded-lg">
              <Card
                alt={"Your Card"}
                className={`${finalCard.orientation === "upright" ? "rotate-0" : "rotate-180"} shadow-none transition`}
              />
            </div>
          </button>
          <Button variant="ghost" size="icon" className="p-2" onClick={() => switchOrientation()}>
            <IconRotate className="h-8 w-8" />
          </Button>
          <Button className="mt-4" variant="outline" onClick={() => onSelect(finalCard.name, finalCard.orientation)}>
            CONFIRM
          </Button>
        </>
      ) : (
        <>
          <p className="max-w-xs text-center font-serif text-xl md:mb-10">
            The deck is split.<br></br>Where is your card?
          </p>
          <div className="flex w-full justify-between">
            {["left", "right"].map((side) => (
              <div key={side} className="md:mx-2">
                <button
                  // @ts-ignore
                  onClick={() => handleSelectHalf(side)}
                  className="relative flex h-[200px] w-[170px] scale-50 flex-col items-center rounded-lg transition-all hover:scale-105 md:h-[370px] md:w-[300px] md:scale-100 md:p-4"
                >
                  {(side === "left" ? leftDeck : rightDeck).map((card, cardIndex) => (
                    <div
                      key={cardIndex}
                      className="absolute top-0 md:top-8 "
                      style={{
                        transform: `translate(${-leftDeck.length / 2 + cardIndex + 1}px, ${
                          -leftDeck.length / 2 + cardIndex + 1
                        }px)`, // `rotate(${(Math.floor(Math.random() * 6 - 3) + 1) * 2 - 2}deg)`,
                        zIndex: cardIndex,
                      }}
                    >
                      <Card alt={`${cardIndex + 1}: ${card.name} ${card.orientation}`} className="" />
                    </div>
                  ))}
                </button>
                <p className="mt-5 text-center font-serif">{side.charAt(0).toUpperCase() + side.slice(1)} Deck</p>
                <p className="text-center font-serif">{side === "left" ? leftDeck.length : rightDeck.length} Cards</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CardSelection;
