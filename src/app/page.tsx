import "../styles/main.css"

import { lazy } from "preact/compat";
import Menu from "../components/menu";

export default function Home() {

  return <div class="roboto-mono">
      <Menu
        buttons={[
          { text: "About me", body: lazy(() => import("../components/menu/body/aboutme")) },
          { text: "My social media", body: lazy(() => import("../components/menu/body/projects")) },
          { text: "Featured projects", body: lazy(() => import("../components/menu/body/social")) }
        ]}
      />
    </div>
}
