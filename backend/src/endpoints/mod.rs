mod tournament;
mod team;
mod player;
mod series;
mod authorization;

use actix_web::web::{
    scope, ServiceConfig,
};

pub fn api_routes(cfg: &mut ServiceConfig) {
    cfg
        .service(authorization::auth_route)
        .service(
            scope("/api/v1")
                .service(authorization::revalidate)
                .configure(tournament::tournament_routes)
                .configure(team::team_routes)
                .configure(player::player_routes)
                .configure(series::series_routes)
        );
}