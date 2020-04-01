import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import { colors } from 'styles';
import { signIn, signOut } from 'store/session';
import { FacebookIcon, LoadingIcon, ChevronDownIcon } from 'components/icons';

const BodyBackgroundColor = createGlobalStyle`
  body {
    background: ${colors.primary};
  }
`;

const Container = styled.div`
  margin: 0 auto;
  text-align: center;
  color: ${colors.light};

  & a {
    color: ${colors.light};
  }
`;

const Screenful = styled.div`
  min-height: calc(100vh - 60px);
  padding-bottom: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const LangoLogo = styled.img`
  height: 110px;
  margin-bottom: 0.5rem;
`;

const HeaderText = styled.div`
  font-weight: bold;
`;

const FBLoginButtonWrapper = styled.div`
  margin-bottom: 4vh;
`;

const FacebookButton = styled.button`
  padding: 1rem;
  border: none;
  border-radius: 0.25rem;
  background-color: ${colors.facebook};
  color: ${colors.light};
  font-weight: bold;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;

  svg {
    margin-right: 0.5rem;
  }
`;

const SmallText = styled.div`
  font-size: 0.75rem;
  margin-bottom: 2rem;
`;

const ReadMore = styled.div`
  color: ${colors.light};

  svg {
    margin-top: 0.5rem;
  }
`;


const Section = styled.div`
  text-align: left;
`;

const SectionHeader = styled.h2`
  margin-top: 0.5rem;
  font-size: 1.125rem;
  text-align: left;
`;

class LandingPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { loading: false };
    this.login = this.login.bind(this);
  }

  login() {
    this.setState({ loading: true });

    window.FB.login((loginResponse) => {
      const fbFields = { fields: ['last_name', 'first_name', 'email', 'picture.width(500).height(500)'] };

      if (loginResponse.authResponse) {
        window.FB.api('/me', fbFields, (userResponse) => {
          this.props.signIn({ ...userResponse, ...loginResponse.authResponse });
        });
      } else {
        this.props.signOut();
        this.setState({ loading: false });
      }
    }, { scope: 'email,public_profile', return_scopes: true });
  }

  render() {
    const ExternalLink = ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;

    const linkVantaa = <ExternalLink href="https://vantaa.fi">Vantaan kaupungin</ExternalLink>;
    const linkHelmet = <ExternalLink href="https://helmet.fi">Helmet-kirjastojen</ExternalLink>;
    const linkOulu = <ExternalLink href="https://ouka.fi/oulu/kirjasto">Oulun kaupunginkirjaston</ExternalLink>;
    const linkHakunila = <ExternalLink href="https://hakunila.org">Hakunilan kansainvälisen yhdistyksen</ExternalLink>;
    const linkNicehearts = <ExternalLink href="http://nicehearts.com">Nicehearts ry:n</ExternalLink>;

    const eulaFi = <Link to="/eula">käyttöehdot</Link>;
    const eulaEn = <Link to="/eula-en">terms of use</Link>;
    const privacyFi = <Link to="/privacy">tietosuojakäytännön</Link>;
    const privacyEn = <Link to="/privacy-en">data protection practice</Link>;

    return (
      <Container>
        <BodyBackgroundColor />
        <Screenful>
          <header>
            <LangoLogo src="/lango-logo.svg" alt="Lango" />
            <HeaderText>
              Keskustele, ystävysty ja
              <br />
              kehitä kielitaitoasi!
            </HeaderText>
          </header>

          <div style={{ fontSize: '3rem', color: colors.light }}>
            {this.state.loading && <LoadingIcon />}
          </div>

          <div>
            <FBLoginButtonWrapper>
              <FacebookButton onClick={this.login}>
                <FacebookIcon /> Kirjaudu Facebookilla
              </FacebookButton>
            </FBLoginButtonWrapper>

            <SmallText>
              <p>
                Jatkamalla kirjautumiseen hyväksyt {eulaFi} ja {privacyFi}.
                <br />
                By signing in, you are agreeing to {eulaEn} and {privacyEn}.
              </p>

              <p>
                Lango toimii parhaiten uusimmilla Chrome ja Safari -selaimilla.
                <br />
                Lango is compatible with the latest versions of Chrome and Safari browsers.
              </p>
            </SmallText>

            <ReadMore>Lue lisää<br /><ChevronDownIcon /></ReadMore>
          </div>
        </Screenful>

        <Section>
          <SectionHeader>Kieltä oppii parhaiten puhumalla!</SectionHeader>

          <p>
            Haluaisitko puhua paremmin suomea? Vai onko ruotsi ruosteessa?
            Tai ehkä opettelisitkin arabiaa? Voit myös auttaa muita
            oppimaan – kielikavereita kaipaavat monet maahanmuuttajista
            kantasuomalaisiin.
          </p>

          <p>
            Luo Langoon oma profiili, niin Lango ehdottaa sinulle sopivia
            kielikavereita. Voit lähetellä kielikaverisi kanssa viestejä
            ja sopia tapaamisen esimerkiksi kirjaston tiloihin. Voitte
            jutella pelkästään verkossakin esimerkiksi Skypen
            välityksellä.
          </p>

          <p>
            Rekisteröidyt Langon käyttäjäksi hyödyntäen Facebook-tiliäsi,
            josta siirtyvät Langoon etunimi, profiilikuva ja
            sähköpostiosoite. Lue <Link to="/faq">täältä</Link>,
            miksi vaadimme Facebook-kirjautumisen.
          </p>

          <p>
            Lango on kehitetty aluehallintoviraston ja {linkVantaa} rahoittamassa projektissa
            yhteistyössä {linkHelmet}, {linkOulu}, {linkHakunila} ja {linkNicehearts} kanssa.
          </p>

          <p>Langoa ylläpitävät Vantaan kaupunginkirjasto & Vantaan tietohallinto.</p>
        </Section>

        <img
          style={{ height: '100px', padding: '1rem' }}
          src="/vantaa_logo.png"
          alt="Vantaan kaupunki"
        />
      </Container>
    );
  }
}

LandingPage.propTypes = {
  signIn: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  signIn,
  signOut,
};

export default connect(null, mapDispatchToProps)(LandingPage);
