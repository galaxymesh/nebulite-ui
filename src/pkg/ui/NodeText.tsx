import { UiNode, UiNodeTextAttributes, UiText } from "@ory/client";

interface Props {
  node: UiNode;
  attributes: UiNodeTextAttributes;
}

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const Code = (props: CodeProps) => <div {...props} />;

export interface CodeBoxProps extends React.HTMLAttributes<HTMLPreElement> {
  code: string;
}

const CodeBox = ({ children, code, ...props }: CodeBoxProps) => (
  <pre {...props}>
    <Code dangerouslySetInnerHTML={{ __html: code }} />
  </pre>
);

export interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const P = (props: ParagraphProps) => <div {...props} />;

/*
const ScrollableCodeBox = styled(CodeBox)`
  overflow-x: auto;
`;
*/

const Content = ({ node, attributes }: Props) => {
  switch (attributes.text.id) {
    case 1050015:
      // This text node contains lookup secrets. Let's make them a bit more beautiful!
      const secrets = (attributes.text.context as any).secrets.map(
        (text: UiText, k: number) => (
          <div
            key={k}
            data-testid={`node/text/${attributes.id}/lookup_secret`}
            className="col-xs-3"
          >
            {/* Used lookup_secret has ID 1050014 */}
            <code>{text.id === 1050014 ? "Used" : text.text}</code>
          </div>
        )
      );
      return (
        <div
          className="container-fluid"
          data-testid={`node/text/${attributes.id}/text`}
        >
          <div className="row">{secrets}</div>
        </div>
      );
  }

  return (
    <div data-testid={`node/text/${attributes.id}/text`}>
      <CodeBox code={attributes.text.text} />
    </div>
  );
};

export const NodeText = ({ node, attributes }: Props) => {
  return (
    <>
      <P data-testid={`node/text/${attributes.id}/label`}>
        {node.meta?.label?.text}
      </P>
      <Content node={node} attributes={attributes} />
    </>
  );
};
