import "@/styles/globals.css";
import BlueskyIcon from "@/assets/bluesky.svg?react"
import GithubIcon from "@/assets/github.svg?react"
import YoutubeIcon from "@/assets/youtube.svg?react"
import DiscordIcon from "@/assets/discord.svg?react"

type IconType = React.FunctionComponent<
    React.ComponentProps<"svg"> & { title?: string, titleId?: string, desc?: string, descId?: string }
>

function SocialBtn({ title, link, icon: Icon }: { title: string, link: string, icon: IconType }) {
    return <a title={title} href={link} class="p-3 border border-white/50 rounded-lg transition-all duration-300 neon-glow-button hover:bg-white hover:text-black">
        <Icon class="w-6 h-6" fill="currentColor" />
    </a>
}

function ContactBtn({ title, link }: { title: string, link: string }) {
    return <a href={link} class="inline-block bg-transparent border border-white/50 py-2 px-6 rounded-lg transition-all duration-300 neon-glow-button hover:bg-white hover:text-black">
        {title}
    </a>
}

export function App() {
    return <main class="retro-grid text-white flex items-center justify-center min-h-screen p-4">

    <div class="bg-black bg-opacity-80 border border-white/30 rounded-xl p-6 sm:p-8 max-w-lg w-full text-center neon-glow backdrop-blur-sm">
        
        <div class="mx-auto mb-6">
            <img 
                src="https://avatars.githubusercontent.com/u/47297843?v=4" 
                alt="Avatar" 
                class="w-32 h-32 object-cover rounded-xl mx-auto border-2 border-white/50"
            />
        </div>

        <h1 class="text-4xl md:text-4xl mb-4 tracking-wider">I'm offline!</h1>

        <p class="text-lg md:text-lg text-white/80 mb-6">
            I (meowabyte) am currently offline and took a break off the most social media platforms completely
            for sorting stuff privately as well as for taking a break.
        </p>

        <div class="mb-8">
            <h2 class="text-2xl mb-4">Find me here</h2>
            <div class="flex items-center justify-center space-x-4">
                <SocialBtn title="GitHub" icon={GithubIcon} link="https://github.com/meowabyte" />
                <SocialBtn title="YouTube" icon={YoutubeIcon} link="https://www.youtube.com/@meowabyte" />
                <SocialBtn title="Bluesky" icon={BlueskyIcon} link="https://bsky.app/profile/meowpa.ws" />
                <SocialBtn title="Discord" icon={DiscordIcon} link="https://discord.gg/tqssnTUxDR" />
            </div>
        </div>

        <div>
            <h2 class="text-2xl mb-4">Contact</h2>
            <p class="text-white/80 mb-4">In case something urgent happens, reach me out here:</p>
            <div class="flex items-center justify-center space-x-4">
                <ContactBtn title="Email" link="mailto:purr@meowpa.ws" />
                <ContactBtn title="Telegram" link="https://t.me/meowabyte" />
            </div>
        </div>
    </div>
</main>;
}
