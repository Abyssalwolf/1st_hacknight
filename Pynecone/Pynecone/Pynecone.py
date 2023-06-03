import pynecone as pc
import random


class State(pc.State):

    count = 0

    def decrement(self):
        self.count -= 1

    def random(self):
        self.count = random.randint(-100, 100)

    def increment(self):
        self.count += 1


def index():
    return pc.center(
        pc.vstack(
            pc.heading(State.count),
            pc.hstack(
                pc.button("Decrement", on_click=State.decrement, color_scheme="red",border_radius="5em"),
                pc.button("Randomize", on_click=State.random, color_scheme="blue",border_radius="5em"),
                pc.button("Increment", on_click=State.increment, color_scheme="green",border_radius="5em"),
            ),
            padding="2em",
            bg="#75D9B3",
            border_radius=".5em",
            box_shadow="10px 10px 8px #888888",
        ),
        padding_y="5em",
        font_size="3em",
        text_align="center",
    )


app = pc.App(state=State)
app.add_page(index, title="Counter")
app.compile()