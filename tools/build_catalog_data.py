"""Build a curated 50-80 game data module from the classroomgame embed catalog."""
from __future__ import annotations
import json
from pathlib import Path

TSV = Path("docs/embed-remaining-2026-08-28.tsv")
OUT = Path("tools/catalog-game-pages-data.mjs")

# (embed_name, display_name, category, controls, tip)
CATALOG = [
    ("1010-color-match.html", "1010 Color Match Unblocked", "color puzzle", "Tap matching color blocks to clear them from the board.", "Keep the center open and clear small groups first."),
    ("3d-bowling.html", "3D Bowling Unblocked", "bowling game", "Use the mouse or touch controls to aim, set power, and roll the ball.", "Aim at the center pin and use a medium power level."),
    ("3d-free-kick.html", "3D Free Kick Unblocked", "sports game", "Drag or tap to aim the ball, then set power with the on-screen control.", "Pick a corner and avoid the wall when the shot is close."),
    ("archery.html", "Archery Unblocked", "sports game", "Use the mouse or touch input to aim, pull back, and release the arrow.", "Hold the aim steady and release in one smooth movement."),
    ("aquaparkio.html", "AquaPark Unblocked", "io game", "Use the arrow keys or on-screen joystick to move around the water park.", "Collect points while keeping enough space to avoid other players."),
    ("backyard-baseball.html", "Backyard Baseball Unblocked", "baseball game", "Use the mouse or tap buttons to swing, run, and choose a pitch.", "Wait for a good pitch instead of swinging at every ball."),
    ("backyard-football.html", "Backyard Football Unblocked", "football game", "Use the arrow keys to move and the action button to pass or tackle.", "Short passes are safer than one long play in the first round."),
    ("ball-sort-halloween.html", "Ball Sort Halloween Unblocked", "color puzzle", "Tap a tube and then tap another tube to move a colored ball.", "Keep one tube open for a later color match."),
    ("ball-sort-soccer.html", "Ball Sort Soccer Unblocked", "color puzzle", "Tap a tube and then tap the destination tube to sort the balls.", "Plan the move before you fill the last open space."),
    ("basket-and-ball.html", "Basket and Ball Unblocked", "physics puzzle", "Use the arrow keys or touch controls to roll and jump the ball.", "Push the basket into position before you take a jump."),
    ("basket-champs.html", "Basket Champs Unblocked", "basketball game", "Use the arrow keys to move and the shoot button when you are near the hoop.", "Move to an open spot before shooting for a better angle."),
    ("basketball-stars.html", "Basketball Stars Unblocked", "basketball game", "Use the on-screen buttons to move, jump, and shoot in quick matches.", "Keep a small distance before shooting so the defender cannot block."),
    ("big-tower-tiny-square.html", "Big Tower Tiny Square Unblocked", "platformer game", "Use the arrow keys or WASD to jump and climb through each level.", "Plan the next jump before you leave the current platform."),
    ("block-blast.html", "Block Blast Unblocked", "block puzzle", "Tap a block and then tap the board position where you want it.", "Fill the far side of the board before the center closes."),
    ("block-breaker.html", "Block Breaker Unblocked", "arcade game", "Use the mouse or touch controls to move the paddle and bounce the ball.", "Keep the ball moving toward the top row of blocks."),
    ("block-the-pig.html", "Block the Pig Unblocked", "puzzle game", "Tap a grid cell to place a block and stop the pig from reaching the exit.", "Place the first block near the path the pig uses most often."),
    ("bubble-pop-adventures.html", "Bubble Pop Adventures Unblocked", "arcade puzzle", "Tap a group of matching bubbles to pop them before the board fills.", "Start with the largest group to make more room."),
    ("bubble-shooter.html", "Bubble Shooter Unblocked", "arcade puzzle", "Tap the shooter to aim and release a bubble at the matching color.", "Aim at the bottom of a matching group for a bigger drop."),
    ("capybara-clicker.html", "Capybara Clicker Unblocked", "clicker game", "Click or tap the capybara to earn points and buy upgrades.", "Buy the first upgrade early so it starts earning while you click."),
    ("cluster-rush.html", "Cluster Rush Unblocked", "reflex game", "Use the arrow keys or touch controls to steer your cluster and avoid obstacles.", "Look one move ahead instead of focusing on the center."),
    ("coreball.html", "Coreball Unblocked", "reaction game", "Tap or click to move through the rings in the correct direction.", "Pause for a moment at each ring instead of tapping quickly."),
    ("cookie-clicker-2.html", "Cookie Clicker 2 Unblocked", "clicker game", "Click the cookie and use the shop to buy upgrades and helpers.", "Compare the cost and the return before making a purchase."),
    ("dino-game.html", "Dino Game Unblocked", "arcade game", "Tap or press SPACE to jump over obstacles in the running dino game.", "Jump early when a small obstacle is close to the ground."),
    ("doodle-baseball.html", "Doodle Baseball Unblocked", "baseball game", "Use the mouse or touch input to swing at the approaching pitch.", "Wait until the ball is over the plate before you swing."),
    ("doodle-champion-island.html", "Doodle Champion Island Unblocked", "sports adventure", "Use the arrow keys or touch controls to move and choose an activity.", "Complete one event before exploring a new area."),
    ("doodle-cricket.html", "Doodle Cricket Unblocked", "cricket game", "Use the mouse or touch controls to select a shot and time the swing.", "Watch the bowler's run-up before selecting an aggressive shot."),
    ("eggy-car.html", "Eggy Car Unblocked", "driving game", "Use the left and right arrow keys or touch buttons to balance the egg.", "Adjust in small movements before the car tips too far."),
    ("fireboy-and-watergirl.html", "Fireboy and Watergirl Unblocked", "co-op puzzle", "Use the arrow keys for Watergirl and WASD for Fireboy in cooperative play.", "Coordinate both characters before moving through a new room."),
    ("fireboy-watergirl-2.html", "Fireboy and Watergirl 2 Unblocked", "co-op puzzle", "Use the arrow keys and WASD to move both characters through the temple.", "Keep the water and fire characters away from the wrong element."),
    ("fishing-and-lines.html", "Fishing and Lines Unblocked", "fishing game", "Use the mouse or touch controls to cast, reel, and catch fish.", "Reel slowly when the line is almost at the surface."),
    ("fishing-frenzy.html", "Fishing Frenzy Unblocked", "fishing game", "Tap or click to cast and then use the on-screen controls to reel in fish.", "Watch the meter and release the reel before the fish escapes."),
    ("flappy-dunk.html", "Flappy Dunk Unblocked", "arcade game", "Tap or press SPACE to fly and try to land the ball through the hoop.", "Keep the tap rhythm steady instead of pressing rapidly."),
    ("freecell-solitaire.html", "FreeCell Solitaire Unblocked", "card game", "Drag or tap cards to move them between columns and foundations.", "Use the free cells carefully and do not fill them all early."),
    ("fruit-merge.html", "Fruit Merge Unblocked", "merge puzzle", "Tap or drag matching fruit together to merge them into a bigger fruit.", "Merge one type first before spreading across the board."),
    ("g-switch.html", "G Switch Unblocked", "reaction game", "Tap or press SPACE to switch gravity and avoid obstacles.", "Change gravity just before a platform ends, not after."),
    ("g-switch-2.html", "G Switch 2 Unblocked", "reaction game", "Tap or press SPACE to flip gravity and race toward the goal.", "Wait for a safe surface before the next gravity flip."),
    ("head-soccer-2023.html", "Head Soccer 2023 Unblocked", "soccer game", "Use the arrow keys or touch controls to move, jump, and kick.", "Stay between the ball and your goal before attacking."),
    ("hexanautio.html", "Hexanaut Unblocked", "io game", "Use the arrow keys or on-screen joystick to move around the hexagonal board.", "Keep a clear route back to your own territory."),
    ("hill-climb-racing.html", "Hill Climb Racing Unblocked", "racing game", "Use the gas and brake controls to keep the vehicle balanced on hills.", "Release the gas on the top of a hill before the drop."),
    ("idle-breakout.html", "Idle Breakout Unblocked", "idle game", "Click or tap to launch balls and buy upgrades between rounds.", "Upgrade ball speed before adding an extra ball."),
    ("idle-dice.html", "Idle Dice Unblocked", "idle game", "Click or tap to roll dice and spend the points on upgrades.", "Keep one upgrade focused on the best return per point."),
    ("infinite-craft.html", "Infinite Craft Unblocked", "crafting puzzle", "Tap two elements to combine them and discover new creations.", "Try obvious pairs first, then test an unexpected combination."),
    ("little-alchemy.html", "Little Alchemy Unblocked", "crafting puzzle", "Tap two elements on the board to combine them into something new.", "Start with basic pairs to unlock more useful ingredients."),
    ("little-alchemy-2.html", "Little Alchemy 2 Unblocked", "crafting puzzle", "Tap elements from the list and combine them to discover new items.", "Combine a new element with an old one before trying rare pairs."),
    ("marbles-sorting.html", "Marbles Sorting Unblocked", "sorting puzzle", "Tap a marble set and then tap another set to move one marble.", "Create a fully sorted set before the board becomes crowded."),
    ("moto-x3m-2.html", "Moto X3M 2 Unblocked", "racing game", "Use the gas, brake, and flip controls to complete each motorbike level.", "Land the bike flat before adding speed on the next ramp."),
    ("moto-x3m-3.html", "Moto X3M 3 Unblocked", "racing game", "Use the accelerator and brake controls to clear the obstacles in each level.", "Slow down before a spike and speed up after a clean landing."),
    ("neon-hill-rider.html", "Neon Hill Rider Unblocked", "racing game", "Use the gas and brake controls to keep the vehicle balanced over hills.", "Keep the wheels on the ground at the top of each hill."),
    ("ovo.html", "OVO Unblocked", "platformer game", "Use the arrow keys or WASD to run, jump, and slide through the levels.", "Look for the checkpoint before trying a difficult jump."),
    ("ovo-2.html", "OVO 2 Unblocked", "platformer game", "Use the arrow keys or WASD to move and jump through the next set of levels.", "Slow down before a moving obstacle and jump after it clears."),
    ("penalty-kick-online.html", "Penalty Kick Online Unblocked", "soccer game", "Use the mouse or touch controls to aim the ball and set shot power.", "Aim for the lower corner to make the shot harder to save."),
    ("ping-pong-chaos.html", "Ping Pong Chaos Unblocked", "table game", "Use the mouse or touch controls to move the paddle and return the ball.", "Move toward the center before the ball crosses the table."),
    ("pop-it-master.html", "Pop It Master Unblocked", "casual game", "Tap the bubbles in a row to pop them and clear the board.", "Follow the pattern from one edge to avoid a missed tap."),
    ("pudding-monsters.html", "Pudding Monsters Unblocked", "puzzle game", "Drag or tap a monster to move it and merge it with the others.", "Plan the move that joins two monsters before adding a new one."),
    ("raft-wars.html", "Raft Wars Unblocked", "physics game", "Use the mouse or touch controls to aim and launch objects from your raft.", "Use a medium power shot before trying a top-corner attack."),
    ("retro-bowl.html", "Retro Bowl Unblocked", "football game", "Use the arrow keys to select a play and the action button to pass or run.", "Choose a short route when the defense is close."),
    ("slope-2.html", "Slope 2 Unblocked", "speed runner", "Use the left and right arrow keys or touch controls to steer the ball.", "Look farther down the ramp to prepare for the next turn."),
    ("spider-solitaire.html", "Spider Solitaire Unblocked", "card game", "Drag or tap cards to build descending sequences in the same suit.", "Build long sequences before moving cards to an empty column."),
    ("tomb-of-the-mask.html", "Tomb of the Mask Unblocked", "arcade game", "Use the arrow keys or swipe controls to move through the maze.", "Choose a clear side of the maze before the timer runs out."),
    ("townscaper.html", "Townscaper Unblocked", "creative game", "Click or tap the water grid to build houses and small neighborhoods.", "Build in small groups to make the town easier to read."),
    ("truck-trials.html", "Truck Trials Unblocked", "racing game", "Use the gas, brake, and balance controls to drive over the obstacles.", "Slow down on the ramp and balance before accelerating."),
    ("tunnel-rush.html", "Tunnel Rush Unblocked", "speed runner", "Use the left and right arrow keys or touch controls to avoid the tunnel walls.", "Keep moving early so a turn does not arrive too late."),
    ("vex-4.html", "Vex 4 Unblocked", "platformer game", "Use the arrow keys to jump, slide, and climb through the levels.", "Slide under a barrier and stand up immediately after clearing it."),
    ("wheely-2.html", "Wheely 2 Unblocked", "puzzle adventure", "Use the mouse or touch controls to interact with objects and solve the puzzle.", "Look for the object with an arrow before clicking the next item."),
    ("word-slide.html", "Word Slide Unblocked", "word puzzle", "Tap or drag letters to form the hidden word before the timer ends.", "Start with common letters and test the middle of the word first."),
    ("worlds-hardest-game.html", "World's Hardest Game Unblocked", "puzzle game", "Use the arrow keys or WASD to move the red square and collect coins.", "Wait for a clear gap before crossing the moving area."),
    ("tri-peaks-solitaire.html", "Tri Peaks Solitaire Unblocked", "card game", "Tap cards one higher or lower than the open card to clear the peaks.", "Clear the bottom row first to expose more cards."),
    ("the-bin-sorting-game.html", "Bin Sorting Game Unblocked", "sorting puzzle", "Tap or drag items into the correct bin before the round ends.", "Sort one type at a time to keep the board easy to read."),
]

def main() -> None:
    targets: dict[str, str] = {}
    with TSV.open(encoding="utf-8") as handle:
        handle.readline()
        for line in handle:
            parts = line.rstrip("\n").split("\t")
            if len(parts) >= 3:
                targets[parts[0]] = parts[2]
    missing = [item[0] for item in CATALOG if item[0] not in targets]
    if missing:
        raise SystemExit("missing embed names: " + ", ".join(missing))

    lines = [
        "// Curated 50-80 classroom-friendly games from docs/embed-remaining-2026-08-28.tsv.",
        "// Regenerate with: python tools/build_catalog_data.py",
        "export const CATALOG_GAME_PAGES = ["
    ]
    for embed, name, category, controls, tip in CATALOG:
        target = targets[embed]
        slug = embed.removesuffix(".html")
        short_name = name.removesuffix(" Unblocked")
        noun = category if category.endswith(" game") else category + " game"
        intro = f"{name} is a {noun} from the classroom catalog. It loads directly in the game area, so you can start a short round without downloading software.\n\n{name} is a good choice when you want a quick browser break that is easy to explain and simple to pause."
        why = f"{name} fits a classroom because the rules are short, the round size is flexible, and the controls are readable on a school computer."
        how = f"Start {name}, use the on-screen controls, and try one short round before changing the difficulty or starting again."
        students = f"You can open {name} in the browser and start playing right away. A short round makes it easy to stop when the next part of class begins."
        teachers = f"{name} is useful as a short supervised activity. Set a time limit before the round starts and ask students to stop at a clear point."
        safety = f"{name} is embedded from a third-party browser page. It should not ask for payment or personal details, but teachers should review the source and follow school network rules."
        lines.append("  {")
        fields = {
            "slug": slug,
            "name": name,
            "shortName": short_name,
            "category": category,
            "titleTag": "Fun Class Break",
            "embedUrl": target,
            "source": target,
            "controls": controls,
            "mobileControls": "Use the on-screen or touch controls shown by the game on a phone or tablet.",
            "intro": intro,
            "why": why,
            "howToPlay": how,
            "students": students,
            "teachers": teachers,
            "tip": tip,
            "safety": safety,
        }
        for key, value in fields.items():
            lines.append(f"    {json.dumps(key)}: {json.dumps(value)},")
        lines.append("  },")
    lines.append("];")
    lines.append("")
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"written={OUT} entries={len(CATALOG)}")

if __name__ == "__main__":
    main()
