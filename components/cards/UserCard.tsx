interface Props {
    id: string;
    name: string;
    username: string;
    imgUrl: string;
    personType: string;
}

export default function UserCard({ id, name, username, imgUrl, personType }: Props) {
    return <article>UserCard</article>;
}
