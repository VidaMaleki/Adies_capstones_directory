import * as React from "react";

interface IBackgroundProps {
    image: string;
}

const Background: React.FunctionComponent<IBackgroundProps> = (props) => {
    const {image} = props;
    return (
    <div className=" min-h-screen lg:flexblg:w-1/2 xl:w-1/3 2xwl:w-3/4 bg-contain bg-no-repeat bg-center"
    style={{backgroundImage: `url(${image})`}}>
    </div>);
}

export default Background;