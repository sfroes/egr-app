import React from 'react';
import '/styles/smc-egr-design-system.css';
import { PUCMinasLogo } from './components/PUCMinasLogo';

export default function App() {
  return (
    <div className="smc-egr-bg-light" style={{ minHeight: '100vh' }}>
      {/* Header Responsivo */}
      <header className="smc-egr-bg-white smc-egr-shadow-sm smc-egr-p-responsive smc-egr-mb-xl">
        <div className="smc-egr-container">
          <div className="smc-egr-d-flex smc-egr-items-center smc-egr-justify-between smc-egr-flex-wrap smc-egr-gap-md">
            <div className="smc-egr-d-flex smc-egr-items-center smc-egr-gap-md">
              <PUCMinasLogo size="sm" />
              <div>
                <h1 className="smc-egr-text-xl smc-egr-text-bold smc-egr-m-0">SMC-EGR Design System</h1>
                <p className="smc-egr-text-sm smc-egr-text-muted smc-egr-m-0 smc-egr-d-mobile-none">Sistema Responsivo</p>
              </div>
            </div>
            <div className="smc-egr-d-flex smc-egr-gap-sm">
              <button className="smc-egr-btn smc-egr-btn-ghost smc-egr-btn-sm">Docs</button>
              <button className="smc-egr-btn smc-egr-btn-primary smc-egr-btn-sm">Começar</button>
            </div>
          </div>
        </div>
      </header>

      <main className="smc-egr-container smc-egr-pb-xl">
        {/* Hero Section com Logo PUC */}
        <section className="smc-egr-text-center smc-egr-mb-2xl smc-egr-pt-xl">
          <div className="smc-egr-d-flex smc-egr-justify-center smc-egr-mb-lg">
            <PUCMinasLogo size="xl" />
          </div>
          <h2 className="smc-egr-text-3xl smc-egr-text-bold smc-egr-mb-md">
            Sistema de Design Responsivo
          </h2>
          <p className="smc-egr-text-lg smc-egr-text-muted smc-egr-mb-xl">
            Componentes adaptáveis para todos os dispositivos
          </p>
          <div className="smc-egr-d-flex smc-egr-gap-md smc-egr-justify-center smc-egr-flex-wrap">
            <button className="smc-egr-btn smc-egr-btn-primary smc-egr-btn-lg">
              Explorar Componentes
            </button>
            <button className="smc-egr-btn smc-egr-btn-outline smc-egr-btn-lg">
              Ver Documentação
            </button>
          </div>
        </section>

        {/* Demonstração de Responsividade */}
        <section className="smc-egr-mb-2xl">
          <h3 className="smc-egr-text-2xl smc-egr-text-bold smc-egr-mb-lg">Grid Responsivo</h3>
          
          <div className="smc-egr-alert smc-egr-alert-info smc-egr-mb-lg">
            <strong>Dica:</strong> Redimensione a janela para ver os componentes se adaptarem automaticamente!
          </div>

          {/* Grid automático responsivo */}
          <div className="smc-egr-grid-responsive smc-egr-mb-lg">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="smc-egr-card">
                <div className="smc-egr-card-body smc-egr-text-center">
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    backgroundColor: `var(--smc-egr-${['green', 'blue', 'red', 'pink', 'green', 'blue'][num - 1]}-200)`,
                    margin: '0 auto',
                    borderRadius: 'var(--smc-egr-radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--smc-egr-spacing-md)'
                  }}>
                    <span style={{ fontSize: '24px' }}>
                      {['📱', '💻', '🖥️', '⌚', '📲', '🎯'][num - 1]}
                    </span>
                  </div>
                  <h4 className="smc-egr-text-medium smc-egr-mb-xs">Card {num}</h4>
                  <p className="smc-egr-text-sm smc-egr-text-muted smc-egr-m-0">
                    Adapta automaticamente
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Paleta de Cores com Logo PUC */}
        <section className="smc-egr-mb-2xl">
          <h3 className="smc-egr-text-2xl smc-egr-text-bold smc-egr-mb-lg">Identidade Visual</h3>
          
          <div className="smc-egr-card smc-egr-mb-lg">
            <div className="smc-egr-card-body">
              <div className="smc-egr-d-flex smc-egr-flex-column smc-egr-flex-md-row smc-egr-items-center smc-egr-gap-lg">
                <div className="smc-egr-d-flex smc-egr-justify-center">
                  <PUCMinasLogo size="lg" />
                </div>
                <div className="smc-egr-flex-1">
                  <h4 className="smc-egr-text-xl smc-egr-text-medium smc-egr-mb-md">Brasão PUC Minas</h4>
                  <p className="smc-egr-text-muted smc-egr-mb-md">
                    O brasão oficial da Pontifícia Universidade Católica de Minas Gerais 
                    está disponível como componente reutilizável em diversos tamanhos.
                  </p>
                  <div className="smc-egr-d-flex smc-egr-gap-sm smc-egr-flex-wrap">
                    <span className="smc-egr-badge smc-egr-badge-primary">xs</span>
                    <span className="smc-egr-badge smc-egr-badge-secondary">sm</span>
                    <span className="smc-egr-badge smc-egr-badge-accent">md</span>
                    <span className="smc-egr-badge smc-egr-badge-neutral">lg</span>
                    <span className="smc-egr-badge smc-egr-badge-primary">xl</span>
                    <span className="smc-egr-badge smc-egr-badge-secondary">2xl</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="smc-egr-grid smc-egr-grid-cols-2 smc-egr-grid-md-cols-4 smc-egr-gap-md">
            <div className="smc-egr-card">
              <div className="smc-egr-card-body">
                <h4 className="smc-egr-text-sm smc-egr-text-medium smc-egr-mb-md">Verde - Primary</h4>
                <div className="smc-egr-d-flex smc-egr-gap-xs">
                  <div style={{ width: '100%', height: '40px', backgroundColor: 'var(--smc-egr-green-400)' }} className="smc-egr-rounded-md smc-egr-shadow-sm"></div>
                  <div style={{ width: '100%', height: '40px', backgroundColor: 'var(--smc-egr-green-600)' }} className="smc-egr-rounded-md smc-egr-shadow-sm"></div>
                  <div style={{ width: '100%', height: '40px', backgroundColor: 'var(--smc-egr-green-800)' }} className="smc-egr-rounded-md smc-egr-shadow-sm"></div>
                </div>
              </div>
            </div>

            <div className="smc-egr-card">
              <div className="smc-egr-card-body">
                <h4 className="smc-egr-text-sm smc-egr-text-medium smc-egr-mb-md">Azul - Secondary</h4>
                <div className="smc-egr-d-flex smc-egr-gap-xs">
                  <div style={{ width: '100%', height: '40px', backgroundColor: 'var(--smc-egr-blue-400)' }} className="smc-egr-rounded-md smc-egr-shadow-sm"></div>
                  <div style={{ width: '100%', height: '40px', backgroundColor: 'var(--smc-egr-blue-600)' }} className="smc-egr-rounded-md smc-egr-shadow-sm"></div>
                  <div style={{ width: '100%', height: '40px', backgroundColor: 'var(--smc-egr-blue-800)' }} className="smc-egr-rounded-md smc-egr-shadow-sm"></div>
                </div>
              </div>
            </div>

            <div className="smc-egr-card">
              <div className="smc-egr-card-body">
                <h4 className="smc-egr-text-sm smc-egr-text-medium smc-egr-mb-md">Vermelho - Danger</h4>
                <div className="smc-egr-d-flex smc-egr-gap-xs">
                  <div style={{ width: '100%', height: '40px', backgroundColor: 'var(--smc-egr-red-400)' }} className="smc-egr-rounded-md smc-egr-shadow-sm"></div>
                  <div style={{ width: '100%', height: '40px', backgroundColor: 'var(--smc-egr-red-600)' }} className="smc-egr-rounded-md smc-egr-shadow-sm"></div>
                  <div style={{ width: '100%', height: '40px', backgroundColor: 'var(--smc-egr-red-800)' }} className="smc-egr-rounded-md smc-egr-shadow-sm"></div>
                </div>
              </div>
            </div>

            <div className="smc-egr-card">
              <div className="smc-egr-card-body">
                <h4 className="smc-egr-text-sm smc-egr-text-medium smc-egr-mb-md">Rosa - Accent</h4>
                <div className="smc-egr-d-flex smc-egr-gap-xs">
                  <div style={{ width: '100%', height: '40px', backgroundColor: 'var(--smc-egr-pink-400)' }} className="smc-egr-rounded-md smc-egr-shadow-sm"></div>
                  <div style={{ width: '100%', height: '40px', backgroundColor: 'var(--smc-egr-pink-600)' }} className="smc-egr-rounded-md smc-egr-shadow-sm"></div>
                  <div style={{ width: '100%', height: '40px', backgroundColor: 'var(--smc-egr-pink-800)' }} className="smc-egr-rounded-md smc-egr-shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Botões Responsivos */}
        <section className="smc-egr-mb-2xl">
          <h3 className="smc-egr-text-2xl smc-egr-text-bold smc-egr-mb-lg">Componentes de Interface</h3>
          
          <div className="smc-egr-grid smc-egr-grid-cols-1 smc-egr-grid-md-cols-2 smc-egr-gap-lg">
            <div className="smc-egr-card">
              <div className="smc-egr-card-header">
                <h4 className="smc-egr-text-medium smc-egr-m-0">Botões</h4>
              </div>
              <div className="smc-egr-card-body">
                <div className="smc-egr-d-flex smc-egr-flex-wrap smc-egr-gap-sm smc-egr-mb-md">
                  <button className="smc-egr-btn smc-egr-btn-primary">Primary</button>
                  <button className="smc-egr-btn smc-egr-btn-secondary">Secondary</button>
                  <button className="smc-egr-btn smc-egr-btn-danger">Danger</button>
                </div>
                <div className="smc-egr-d-flex smc-egr-flex-wrap smc-egr-gap-sm">
                  <button className="smc-egr-btn smc-egr-btn-outline">Outline</button>
                  <button className="smc-egr-btn smc-egr-btn-ghost">Ghost</button>
                </div>
              </div>
            </div>

            <div className="smc-egr-card">
              <div className="smc-egr-card-header">
                <h4 className="smc-egr-text-medium smc-egr-m-0">Badges e Status</h4>
              </div>
              <div className="smc-egr-card-body">
                <div className="smc-egr-d-flex smc-egr-flex-wrap smc-egr-gap-sm smc-egr-mb-md">
                  <span className="smc-egr-badge smc-egr-badge-primary">Ativo</span>
                  <span className="smc-egr-badge smc-egr-badge-secondary">Em Progresso</span>
                  <span className="smc-egr-badge smc-egr-badge-danger">Urgente</span>
                  <span className="smc-egr-badge smc-egr-badge-accent">Destaque</span>
                  <span className="smc-egr-badge smc-egr-badge-neutral">Pausado</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Formulário Responsivo */}
        <section className="smc-egr-mb-2xl">
          <h3 className="smc-egr-text-2xl smc-egr-text-bold smc-egr-mb-lg">Formulários</h3>
          
          <div className="smc-egr-card">
            <div className="smc-egr-card-header">
              <div className="smc-egr-d-flex smc-egr-items-center smc-egr-gap-md">
                <PUCMinasLogo size="xs" />
                <h4 className="smc-egr-text-medium smc-egr-m-0">Formulário de Contato</h4>
              </div>
            </div>
            <div className="smc-egr-card-body">
              <div className="smc-egr-grid smc-egr-grid-cols-1 smc-egr-grid-md-cols-2 smc-egr-gap-lg">
                <div className="smc-egr-form-group">
                  <label className="smc-egr-label smc-egr-label-required">Nome Completo</label>
                  <input 
                    type="text" 
                    className="smc-egr-input" 
                    placeholder="Digite seu nome"
                  />
                  <span className="smc-egr-form-help">Informe seu nome completo</span>
                </div>

                <div className="smc-egr-form-group">
                  <label className="smc-egr-label smc-egr-label-required">Email</label>
                  <input 
                    type="email" 
                    className="smc-egr-input" 
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="smc-egr-form-group">
                  <label className="smc-egr-label">Telefone</label>
                  <input 
                    type="tel" 
                    className="smc-egr-input" 
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="smc-egr-form-group">
                  <label className="smc-egr-label">Departamento</label>
                  <input 
                    type="text" 
                    className="smc-egr-input" 
                    placeholder="Ex: Sistemas de Informação"
                  />
                </div>
              </div>

              <div className="smc-egr-form-group">
                <label className="smc-egr-label">Mensagem</label>
                <textarea 
                  className="smc-egr-input" 
                  rows={4}
                  placeholder="Digite sua mensagem..."
                  style={{ resize: 'vertical' }}
                ></textarea>
              </div>

              <div className="smc-egr-divider"></div>

              <div className="smc-egr-d-flex smc-egr-gap-sm smc-egr-justify-end smc-egr-flex-wrap">
                <button className="smc-egr-btn smc-egr-btn-ghost">Cancelar</button>
                <button className="smc-egr-btn smc-egr-btn-primary">Enviar Mensagem</button>
              </div>
            </div>
          </div>
        </section>

        {/* Alerts Responsivos */}
        <section className="smc-egr-mb-2xl">
          <h3 className="smc-egr-text-2xl smc-egr-text-bold smc-egr-mb-lg">Notificações e Alertas</h3>
          
          <div className="smc-egr-alert smc-egr-alert-success smc-egr-mb-sm">
            <strong>Sucesso!</strong> Suas alterações foram salvas com sucesso.
          </div>
          <div className="smc-egr-alert smc-egr-alert-info smc-egr-mb-sm">
            <strong>Informação:</strong> Você tem 3 notificações não lidas.
          </div>
          <div className="smc-egr-alert smc-egr-alert-warning smc-egr-mb-sm">
            <strong>Atenção:</strong> Seu plano expira em 7 dias.
          </div>
          <div className="smc-egr-alert smc-egr-alert-danger">
            <strong>Erro:</strong> Não foi possível conectar ao servidor.
          </div>
        </section>

        {/* Tabela Responsiva */}
        <section className="smc-egr-mb-2xl">
          <h3 className="smc-egr-text-2xl smc-egr-text-bold smc-egr-mb-lg">Tabelas Responsivas</h3>
          
          <div className="smc-egr-card">
            <div className="smc-egr-card-body smc-egr-p-0">
              <div className="smc-egr-table-responsive">
                <table className="smc-egr-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Projeto</th>
                      <th>Status</th>
                      <th>Responsável</th>
                      <th>Data</th>
                      <th className="smc-egr-d-mobile-none">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#001</td>
                      <td>Sistema Acadêmico</td>
                      <td><span className="smc-egr-badge smc-egr-badge-primary">Ativo</span></td>
                      <td>João Silva</td>
                      <td>25/11/2024</td>
                      <td className="smc-egr-d-mobile-none">
                        <button className="smc-egr-btn smc-egr-btn-ghost smc-egr-btn-sm">Editar</button>
                      </td>
                    </tr>
                    <tr>
                      <td>#002</td>
                      <td>Portal do Aluno</td>
                      <td><span className="smc-egr-badge smc-egr-badge-secondary">Em Progresso</span></td>
                      <td>Maria Santos</td>
                      <td>20/11/2024</td>
                      <td className="smc-egr-d-mobile-none">
                        <button className="smc-egr-btn smc-egr-btn-ghost smc-egr-btn-sm">Editar</button>
                      </td>
                    </tr>
                    <tr>
                      <td>#003</td>
                      <td>Biblioteca Digital</td>
                      <td><span className="smc-egr-badge smc-egr-badge-danger">Atrasado</span></td>
                      <td>Carlos Oliveira</td>
                      <td>15/11/2024</td>
                      <td className="smc-egr-d-mobile-none">
                        <button className="smc-egr-btn smc-egr-btn-ghost smc-egr-btn-sm">Editar</button>
                      </td>
                    </tr>
                    <tr>
                      <td>#004</td>
                      <td>App Mobile</td>
                      <td><span className="smc-egr-badge smc-egr-badge-neutral">Pausado</span></td>
                      <td>Ana Costa</td>
                      <td>10/11/2024</td>
                      <td className="smc-egr-d-mobile-none">
                        <button className="smc-egr-btn smc-egr-btn-ghost smc-egr-btn-sm">Editar</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Cards Interativos */}
        <section className="smc-egr-mb-2xl">
          <h3 className="smc-egr-text-2xl smc-egr-text-bold smc-egr-mb-lg">Módulos do Sistema</h3>
          
          <div className="smc-egr-grid smc-egr-grid-cols-1 smc-egr-grid-md-cols-2 smc-egr-grid-lg-cols-3 smc-egr-gap-lg">
            <div className="smc-egr-card smc-egr-card-hover">
              <div className="smc-egr-card-body">
                <div className="smc-egr-d-flex smc-egr-items-center smc-egr-gap-md smc-egr-mb-md">
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    backgroundColor: 'var(--smc-egr-green-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }} className="smc-egr-rounded-lg">
                    <span style={{ fontSize: '24px' }}>📊</span>
                  </div>
                  <div>
                    <h4 className="smc-egr-text-medium smc-egr-m-0">Analytics</h4>
                    <p className="smc-egr-text-sm smc-egr-text-muted smc-egr-m-0">Dashboard</p>
                  </div>
                </div>
                <p className="smc-egr-text-sm smc-egr-m-0">
                  Visualize métricas e relatórios em tempo real
                </p>
              </div>
              <div className="smc-egr-card-footer">
                <button className="smc-egr-btn smc-egr-btn-primary smc-egr-btn-sm smc-egr-btn-block">
                  Acessar
                </button>
              </div>
            </div>

            <div className="smc-egr-card smc-egr-card-hover">
              <div className="smc-egr-card-body">
                <div className="smc-egr-d-flex smc-egr-items-center smc-egr-gap-md smc-egr-mb-md">
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    backgroundColor: 'var(--smc-egr-blue-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }} className="smc-egr-rounded-lg">
                    <span style={{ fontSize: '24px' }}>⚙️</span>
                  </div>
                  <div>
                    <h4 className="smc-egr-text-medium smc-egr-m-0">Configurações</h4>
                    <p className="smc-egr-text-sm smc-egr-text-muted smc-egr-m-0">Sistema</p>
                  </div>
                </div>
                <p className="smc-egr-text-sm smc-egr-m-0">
                  Configure preferências e parametrizações
                </p>
              </div>
              <div className="smc-egr-card-footer">
                <button className="smc-egr-btn smc-egr-btn-secondary smc-egr-btn-sm smc-egr-btn-block">
                  Configurar
                </button>
              </div>
            </div>

            <div className="smc-egr-card smc-egr-card-hover">
              <div className="smc-egr-card-body">
                <div className="smc-egr-d-flex smc-egr-items-center smc-egr-gap-md smc-egr-mb-md">
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    backgroundColor: 'var(--smc-egr-pink-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }} className="smc-egr-rounded-lg">
                    <span style={{ fontSize: '24px' }}>👥</span>
                  </div>
                  <div>
                    <h4 className="smc-egr-text-medium smc-egr-m-0">Usuários</h4>
                    <p className="smc-egr-text-sm smc-egr-text-muted smc-egr-m-0">Gerenciamento</p>
                  </div>
                </div>
                <p className="smc-egr-text-sm smc-egr-m-0">
                  Gerencie usuários e permissões do sistema
                </p>
              </div>
              <div className="smc-egr-card-footer">
                <button className="smc-egr-btn smc-egr-btn-outline smc-egr-btn-sm smc-egr-btn-block">
                  Gerenciar
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Exemplo com Logos de Diferentes Tamanhos */}
        <section className="smc-egr-mb-2xl">
          <h3 className="smc-egr-text-2xl smc-egr-text-bold smc-egr-mb-lg">Variações do Brasão</h3>
          
          <div className="smc-egr-card">
            <div className="smc-egr-card-body">
              <p className="smc-egr-text-muted smc-egr-mb-lg">
                O componente PUCMinasLogo está disponível em diversos tamanhos para diferentes contextos de uso:
              </p>
              
              <div className="smc-egr-d-flex smc-egr-items-end smc-egr-gap-lg smc-egr-flex-wrap smc-egr-justify-center">
                <div className="smc-egr-text-center">
                  <PUCMinasLogo size="xs" />
                  <p className="smc-egr-text-xs smc-egr-text-muted smc-egr-mt-xs smc-egr-m-0">Extra Small</p>
                </div>
                <div className="smc-egr-text-center">
                  <PUCMinasLogo size="sm" />
                  <p className="smc-egr-text-xs smc-egr-text-muted smc-egr-mt-xs smc-egr-m-0">Small</p>
                </div>
                <div className="smc-egr-text-center">
                  <PUCMinasLogo size="md" />
                  <p className="smc-egr-text-xs smc-egr-text-muted smc-egr-mt-xs smc-egr-m-0">Medium</p>
                </div>
                <div className="smc-egr-text-center smc-egr-d-mobile-none">
                  <PUCMinasLogo size="lg" />
                  <p className="smc-egr-text-xs smc-egr-text-muted smc-egr-mt-xs smc-egr-m-0">Large</p>
                </div>
                <div className="smc-egr-text-center smc-egr-d-mobile-none">
                  <PUCMinasLogo size="xl" />
                  <p className="smc-egr-text-xs smc-egr-text-muted smc-egr-mt-xs smc-egr-m-0">Extra Large</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer com Logo PUC */}
      <footer className="smc-egr-bg-white smc-egr-border-top smc-egr-p-responsive smc-egr-mt-2xl">
        <div className="smc-egr-container">
          <div className="smc-egr-d-flex smc-egr-flex-column smc-egr-flex-md-row smc-egr-items-center smc-egr-justify-between smc-egr-gap-md">
            <div className="smc-egr-d-flex smc-egr-items-center smc-egr-gap-md">
              <PUCMinasLogo size="xs" />
              <div className="smc-egr-text-center smc-egr-text-md-left">
                <p className="smc-egr-text-sm smc-egr-text-muted smc-egr-m-0">
                  SMC-EGR Design System © 2024
                </p>
                <p className="smc-egr-text-xs smc-egr-text-muted smc-egr-m-0">
                  Pontifícia Universidade Católica de Minas Gerais
                </p>
              </div>
            </div>
            <div className="smc-egr-d-flex smc-egr-gap-sm smc-egr-flex-wrap smc-egr-justify-center">
              <button className="smc-egr-btn smc-egr-btn-ghost smc-egr-btn-sm">Sobre</button>
              <button className="smc-egr-btn smc-egr-btn-ghost smc-egr-btn-sm">Docs</button>
              <button className="smc-egr-btn smc-egr-btn-ghost smc-egr-btn-sm">Contato</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
