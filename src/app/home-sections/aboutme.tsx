import { useState } from "preact/hooks";
import ModalBody from "../../components/modal/modalbody";
import { age, eventFlags } from "../../helpers/utils";
import bdayHat from "../../img/bday-hat.png";

export default function AboutMe() {
    const [avatarLoaded, setAvatarLoaded] = useState(false);

    return (
        <ModalBody className="grid max-lg:w-4/5 max-md:grid-rows-[0.5fr_2fr] md:grid-cols-[1fr_2fr] gap-5">
            <div class="relative">
                {eventFlags.includes("BIRTHDAY") && avatarLoaded && (
                    <img
                        height={70}
                        width={70}
                        alt="Birthday hat"
                        src={bdayHat}
                        class="absolute left-[30%] -translate-x-1/2 -top-20 -rotate-12"
                    />
                )}
                <img
                    onLoad={() => setAvatarLoaded(true)}
                    className="justify-self-center"
                    width={400}
                    height={400}
                    src="https://github.com/meowabyte.png?size=400"
                    alt="Avatar"
                />
            </div>

            <div className="overflow-y-auto">
                <h2 className="mb-5">About me</h2>
                <span>
                    Hi! I'm Kuba! I'm a {age}-year-old software developer. I am passionate in AI, analytics and
                    automation of various kinds of things. I like to create things that can make other people's life
                    easier or that can make me happy. In spare time, I like to experiment with other hobbies like video
                    editing or making music. I'd be more than happy if you could show me some support by checking out my
                    projects on GitHub! (and maybe even contribute to them! :D)
                </span>
            </div>
        </ModalBody>
    );
}
