<a id="readme-top"></a>

<img src="https://github.com/AnderMendoza/AnderMendoza/raw/main/assets/line-neon.gif" width="100%">

<p align="center">
  <img alt="GitHub Repo contributors" src="https://img.shields.io/github/contributors/hexed-AAL1X/Pickross?style=for-the-badge">&nbsp;
  <img alt="GitHub Repo forks" src="https://img.shields.io/github/forks/hexed-AAL1X/Pickross?style=for-the-badge">&nbsp;
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/hexed-AAL1X/Pickross?style=for-the-badge">&nbsp;
  <img alt="GitHub Repo issues" src="https://img.shields.io/github/issues/hexed-AAL1X/Pickross?style=for-the-badge">&nbsp;
</p>

<br>

<div align="center">
  <img src="docs/pickcross-logo.png" alt="PickCross" width="320" />
  <h3 align="center">Picross Solver Frontend</h3>
  <p align="center">
    Frontend web (Next.js) para resolver Picross, Color Picross y Mega Picross con animación paso a paso.
    <br>
    <a href="https://github.com/hexed-AAL1X/Pickross"><strong>Explorar repositorio »</strong></a>
    <br><br>
    <a href="https://github.com/hexed-AAL1X/Pickross">Ver código</a>
    ·
    <a href="https://github.com/hexed-AAL1X/Pickross/issues/new?labels=bug">Reportar bug</a>
    ·
    <a href="https://github.com/hexed-AAL1X/Pickross/issues/new?labels=enhancement">Pedir feature</a>
  </p>
</div>

<details>
  <summary>Tabla de contenidos</summary>
  <ol>
    <li><a href="#about-the-project">About the project</a></li>
    <li><a href="#built-with">Built with</a></li>
    <li><a href="#important-notices">Important notices</a></li>
    <li>
      <a href="#getting-started">Getting started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#available-scripts">Available scripts</a></li>
      </ul>
    </li>
    <li>
      <a href="#contributing">Contributing</a>
      <ul>
        <li><a href="#top-contributors">Top contributors</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>
<br>

<a id="about-the-project"></a>***About the project***
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

<p align="center" style="margin: 7px;">
  <img src="docs/dashboard-preview.png" alt="Dashboard de PickCross con Picross en ejecución" width="900" style="margin: 7px;" />
</p>

PickCross es una aplicación web enfocada en resolver puzzles de **Picross** (Nonograma) y sus variaciones.

Incluye:

- Solver de Picross regular, Color Picross y Mega Picross.
- Visualización del tablero con animación paso a paso (play / pause / step / reset).
- Generación de patrones válidos y resolución por restricciones en el cliente.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<a id="built-with"></a>***Built with***
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

- ![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
- ![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
- ![Framer Motion](https://img.shields.io/badge/Framer_Motion-animations-0055FF?style=for-the-badge&logo=framer&logoColor=white)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<a id="important-notices"></a>***Important notices***
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">
> [!NOTE]
> El frontend vive en la carpeta `frontend/`.
>
> Usa `npm run dev` dentro de `frontend` para levantar el servidor local.

> [!IMPORTANT]
> La resolución del puzzle corre en el navegador. No necesitas backend para usar el solver.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<a id="getting-started"></a>***Getting started***
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">
<a id="prerequisites"></a>

### Prerequisites

- Node.js (recomendado: LTS)
- npm

<a id="installation"></a>

### Installation

1) Clonar el repositorio

```bash
git clone https://github.com/hexed-AAL1X/Pickross.git
cd Pickross/frontend
```

2) Instalar dependencias

```bash
npm install
```

3) Ejecutar en modo desarrollo

```bash
npm run dev
```

4) Abrir en el navegador

- `http://localhost:3000/`

<a id="available-scripts"></a>

### Available scripts

```bash
npm run dev      # next dev
npm run build    # build producción
npm run start    # next start
npm run lint     # next lint
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<a id="contributing"></a>***Contributing***
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">
Contribuciones bienvenidas.

1) Fork del proyecto
2) Crear una rama (`git checkout -b feature/nueva-feature`)
3) Commit (`git commit -m "Add: ..."`)
4) Push (`git push origin feature/nueva-feature`)
5) Pull Request

<a id="top-contributors"></a>
### Top contributors

<div align="center">

<table>
  <tr>
    <td align="center" width="160">
      <a href="https://github.com/coshiiiiiiiiii">
        <img src="https://avatars.githubusercontent.com/u/148801435?v=4" width="88" height="88" alt="Ariana Quelopana Puppo" style="border-radius:50%;" /><br />
        <b>Ariana Quelopana Puppo</b><br />
        <sub>@coshiiiiiiiiii</sub>
      </a>
    </td>
    <td align="center" width="160">
      <a href="https://github.com/tsavorae">
        <img src="https://avatars.githubusercontent.com/u/62164801?v=4" width="88" height="88" alt="tera" style="border-radius:50%;" /><br />
        <b>tera</b><br />
        <sub>@tsavorae</sub>
      </a>
    </td>
    <td align="center" width="160">
      <a href="https://github.com/LiamQuinoNeff">
        <img src="https://avatars.githubusercontent.com/u/130613445?v=4" width="88" height="88" alt="Liam Quino Neff" style="border-radius:50%;" /><br />
        <b>Liam Quino Neff</b><br />
        <sub>@LiamQuinoNeff</sub>
      </a>
    </td>
  </tr>
</table>

</div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<a id="contact"></a>***Contact***
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">
<p align="center">
  <a href="mailto:hexed_aal1x.ops@proton.me"><img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white&color=black" /></a>
  <a href="https://www.instagram.com/hexed_aal1x"><img src="https://img.shields.io/badge/instagram-%2312100E.svg?&style=for-the-badge&logo=instagram&logoColor=white&color=black" /></a>
  <a href="https://www.linkedin.com/in/leonardo-bravo-4120b8228/"><img src="https://img.shields.io/badge/linkedin-%2312100E.svg?&style=for-the-badge&logo=linkedin&logoColor=white&color=black" /></a>
</p>
<p align="right">(<a href="#readme-top">back to top</a>)</p>
